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
        _logger.LogDebug("Fetching latest release for artist {ArtistId}", artistId);
        await EnsureAccessTokenAsync(cancellationToken);

        var url = $"{_options.BaseUrl}/artists/{artistId}/albums?include_groups=album,single&market=US&limit=1";

        using var response = await SendWithRetryAsync(url, cancellationToken);

        var page = await response.Content.ReadFromJsonAsync<SpotifyPagedResponse<SpotifyAlbum>>(cancellationToken: cancellationToken);

        var album = page?.Items?.FirstOrDefault();
        if (album is null || string.IsNullOrEmpty(album.Id) || knownSpotifyIds.Contains(album.Id))
            return [];

        return
        [
            new ReleaseDto
            {
                Id = album.Id,
                Artist = album.Artists?.FirstOrDefault()?.Name ?? "Unknown Artist",
                Title = album.Name ?? "Unknown Title",
                ReleaseDate = ParseSpotifyDate(album.ReleaseDate),
                ImageUrl = album.Images?.FirstOrDefault()?.Url ?? string.Empty,
                SpotifyUrl = album.ExternalUrls?.Spotify ?? string.Empty,
                ReleaseType = album.AlbumType ?? "Unknown Release Type",
            }
        ];
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ArtistDto>> SearchArtistsAsync(string query, CancellationToken cancellationToken = default)
    {
        await EnsureAccessTokenAsync(cancellationToken);

        var encodedQuery = Uri.EscapeDataString(query);
        var url = $"{_options.BaseUrl}/search?q={encodedQuery}&type=artist&limit=5";

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
            var elapsed = DateTime.UtcNow - _lastRequestTimeUtc;
            if (elapsed < _currentRequestInterval)
                await Task.Delay(_currentRequestInterval - elapsed, ct);

            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

            _lastRequestTimeUtc = DateTime.UtcNow;
            var response = await _http.SendAsync(request, ct);

            if (response.StatusCode != HttpStatusCode.TooManyRequests)
            {
                response.EnsureSuccessStatusCode();
                return response;
            }

            if (attempt == MaxRetries)
            {
                response.EnsureSuccessStatusCode();
                return response;
            }

            var retryAfter = response.Headers.RetryAfter?.Delta
                             ?? TimeSpan.FromSeconds(Math.Pow(2, attempt) * DefaultRetryDelay.TotalSeconds);

            _logger.LogWarning("Spotify 429 rate-limited on attempt {Attempt}/{MaxRetries}. Retrying after {RetryAfterSeconds:F1}s", attempt + 1, MaxRetries, retryAfter.TotalSeconds);

            _currentRequestInterval = retryAfter;

            response.Dispose();
            await Task.Delay(retryAfter, CancellationToken.None);
        }

        throw new InvalidOperationException("Retry loop exited unexpectedly.");
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