using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Models;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;

namespace Soundfeed.Bll;

public class SpotifyService : ISpotifyService
{
    private const int MaxRetries = 3;
    private static readonly TimeSpan DefaultRetryDelay = TimeSpan.FromSeconds(2);
    private static readonly TimeSpan MinRequestInterval = TimeSpan.FromMilliseconds(150);

    private readonly HttpClient _http;
    private readonly SpotifyOptions _options;
    private readonly ILogger<SpotifyService> _logger;

    private string? _accessToken;
    private DateTime _accessTokenExpiresAtUtc;
    private DateTime _lastRequestTimeUtc = DateTime.MinValue;
    private TimeSpan _currentRequestInterval = MinRequestInterval;

    public SpotifyService(HttpClient http, IOptions<SpotifyOptions> options, ILogger<SpotifyService> logger)
    {
        _http = http;
        _options = options.Value;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<ArtistDto> GetArtistAsync(string artistId, CancellationToken cancellationToken = default)
    {
        await EnsureAccessTokenAsync(cancellationToken);

        var url = $"{_options.BaseUrl}/artists/{artistId}";

        using var response = await SendWithRetryAsync(url, cancellationToken);

        var json = await response.Content.ReadFromJsonAsync<SpotifyArtistDetailResponse>(cancellationToken: cancellationToken)
                   ?? throw new InvalidOperationException("Empty response from Spotify artist endpoint.");

        return new ArtistDto
        {
            Name = json.Name,
            ImageUrl = json.Images?.FirstOrDefault()?.Url ?? string.Empty
        };
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ReleaseDto>> GetReleasesForArtistAsync(string artistId, IReadOnlySet<string> knownSpotifyIds, CancellationToken cancellationToken)
    {
        _logger.LogDebug("Fetching latest releases for artist {ArtistId}", artistId);
        await EnsureAccessTokenAsync(cancellationToken);

        var url = $"{_options.BaseUrl}/artists/{artistId}/albums?include_groups=album,single&limit=5";

        using var response = await SendWithRetryAsync(url, cancellationToken);

        var page = await response.Content.ReadFromJsonAsync<SpotifyPagedResponse<SpotifyAlbum>>(cancellationToken: cancellationToken);

        if (page?.Items is null)
            return [];

        return page.Items
            .Where(a => !string.IsNullOrEmpty(a.Id) && !knownSpotifyIds.Contains(a.Id))
            .Select(a => new ReleaseDto
            {
                Id = a.Id!,
                Artist = a.Artists?.FirstOrDefault()?.Name ?? "Unknown Artist",
                Title = a.Name ?? "Unknown Title",
                ReleaseDate = ParseSpotifyDate(a.ReleaseDate),
                ImageUrl = a.Images?.FirstOrDefault()?.Url ?? string.Empty,
                SpotifyUrl = a.ExternalUrls?.Spotify ?? string.Empty,
                ReleaseType = a.AlbumType ?? "Unknown Release Type",
            })
            .ToList();
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ArtistDto>> SearchArtistsAsync(string query, int offset, CancellationToken cancellationToken = default)
    {
        await EnsureAccessTokenAsync(cancellationToken);

        var encodedQuery = Uri.EscapeDataString(query);
        var url = $"{_options.BaseUrl}/search?q={encodedQuery}&type=artist&limit=10&offset={offset}";

        using var response = await SendWithRetryAsync(url, cancellationToken);

        var json = await response.Content.ReadFromJsonAsync<SpotifySearchResponse>(cancellationToken: cancellationToken)
                   ?? throw new InvalidOperationException("Empty response from Spotify search endpoint.");

        return json.Artists?.Items?.Where(a => !string.IsNullOrEmpty(a.Id) && !string.IsNullOrEmpty(a.Name))
            .Select(a => new ArtistDto
            {
                Name = a.Name!,
                SpotifyUrl = $"https://open.spotify.com/artist/{a.Id}",
                ImageUrl = a.Images?.FirstOrDefault()?.Url
            }).ToList() ?? [];
    }

    private async Task EnsureAccessTokenAsync(CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _accessTokenExpiresAtUtc)
        {
            return;
        }

        var authHeader = Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{_options.ClientId}:{_options.ClientSecret}"));

        using var request = new HttpRequestMessage(HttpMethod.Post, _options.TokenUrl);
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);
        request.Content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "client_credentials")
        });

        using var response = await _http.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        var tokenResponse = await response.Content.ReadFromJsonAsync<SpotifyTokenResponse>(cancellationToken: cancellationToken)
            ?? throw new InvalidOperationException("Empty response from Spotify token endpoint.");

        _accessToken = tokenResponse.AccessToken;
        _accessTokenExpiresAtUtc = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn - 60);
    }

    private async Task<HttpResponseMessage> SendWithRetryAsync(string url, CancellationToken ct)
    {
        for (var attempt = 0; attempt <= MaxRetries; attempt++)
        {
            await ThrottleAsync(ct);

            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

            _lastRequestTimeUtc = DateTime.UtcNow;
            var response = await _http.SendAsync(request, ct);

            switch (response.StatusCode)
            {
                case HttpStatusCode.Unauthorized when attempt < MaxRetries:
                    response.Dispose();

                    _logger.LogWarning("Spotify 401 on attempt {Attempt}/{MaxRetries}. Refreshing access token", attempt + 1, MaxRetries);
                    _accessToken = null;
                    await EnsureAccessTokenAsync(ct);

                    continue;

                case HttpStatusCode.TooManyRequests when attempt < MaxRetries:
                    var retryAfter = response.Headers.RetryAfter?.Delta
                        ?? TimeSpan.FromSeconds(Math.Pow(2, attempt) * DefaultRetryDelay.TotalSeconds);

                    _logger.LogWarning("Spotify 429 on attempt {Attempt}/{MaxRetries}. Retrying after {Delay:F1}s", attempt + 1, MaxRetries, retryAfter.TotalSeconds);
                    _currentRequestInterval = retryAfter;
                    response.Dispose();

                    await Task.Delay(retryAfter, CancellationToken.None);

                    continue;

                default:
                    response.EnsureSuccessStatusCode();
                    return response;
            }
        }

        throw new InvalidOperationException("Retry loop exited unexpectedly.");
    }

    private async Task ThrottleAsync(CancellationToken ct)
    {
        var elapsed = DateTime.UtcNow - _lastRequestTimeUtc;
        if (elapsed < _currentRequestInterval)
            await Task.Delay(_currentRequestInterval - elapsed, ct);
    }

    private static DateTime ParseSpotifyDate(string? dateStr)
    {
        if (string.IsNullOrEmpty(dateStr))
            return DateTime.SpecifyKind(DateTime.MinValue, DateTimeKind.Utc);

        var parts = dateStr.Split('-');

        int year = int.Parse(parts[0]);
        int month = parts.Length > 1 ? int.Parse(parts[1]) : 1;
        int day = parts.Length > 2 ? int.Parse(parts[2]) : 1;

        return new DateTime(year, month, day, 0, 0, 0, DateTimeKind.Utc);
    }
}