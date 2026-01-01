using Microsoft.Extensions.Options;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Models;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;

namespace Soundfeed.Bll;

public class SpotifyService : ISpotifyService
{
    private readonly HttpClient _http;
    private readonly SpotifyOptions _options;

    private string? _accessToken;
    private DateTime _accessTokenExpiresAtUtc;

    public SpotifyService(HttpClient http, IOptions<SpotifyOptions> options)
    {
        _http = http;
        _options = options.Value;
    }

    public async Task<ArtistDto> GetArtistAsync(string artistId, CancellationToken cancellationToken = default)
    {
        await EnsureAccessTokenAsync(cancellationToken);

        var url = $"{_options.BaseUrl}/artists/{artistId}";

        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

        using var response = await _http.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadFromJsonAsync<SpotifyArtistDetailResponse>(cancellationToken: cancellationToken)
                   ?? throw new InvalidOperationException("Empty response from Spotify artist endpoint.");

        return new ArtistDto
        {
            Name = json.Name,
            ImageUrl = json.Images?.FirstOrDefault()?.Url ?? string.Empty
        };
    }

    public async Task<IReadOnlyList<ReleaseDto>> GetReleasesForArtistAsync(string artistId, CancellationToken cancellationToken)
    {
        await EnsureAccessTokenAsync(cancellationToken);

        var albumIds = new HashSet<string>();

        var nextUrl = $"{_options.BaseUrl}/artists/{artistId}/albums?include_groups=album,single&limit=50";

        while (!string.IsNullOrWhiteSpace(nextUrl))
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, nextUrl);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

            using var response = await _http.SendAsync(request, cancellationToken);
            response.EnsureSuccessStatusCode();

            var page = await response.Content.ReadFromJsonAsync<SpotifyPagedResponse<SpotifyAlbum>>(cancellationToken: cancellationToken);

            if (page?.Items != null)
            {
                foreach (var item in page.Items)
                {
                    if (!string.IsNullOrEmpty(item.Id))
                    {
                        albumIds.Add(item.Id);
                    }
                }
            }
            nextUrl = page?.Next;
        }

        if (albumIds.Count == 0) return Array.Empty<ReleaseDto>();

        // Fetch album details in batches
        var releases = new List<ReleaseDto>();
        var chunks = albumIds.Chunk(20);

        foreach (var chunk in chunks)
        {
            var idsCsv = string.Join(",", chunk);
            var detailsUrl = $"{_options.BaseUrl}/albums?ids={idsCsv}";

            using var batchRequest = new HttpRequestMessage(HttpMethod.Get, detailsUrl);
            batchRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

            using var batchResponse = await _http.SendAsync(batchRequest, cancellationToken);
            batchResponse.EnsureSuccessStatusCode();

            var details = await batchResponse.Content.ReadFromJsonAsync<SpotifyBatchAlbumResponse>(cancellationToken: cancellationToken);

            if (details?.Albums == null) continue;

            foreach (var album in details.Albums)
            {
                if (album == null || string.IsNullOrEmpty(album.Id)) continue;

                releases.Add(new ReleaseDto
                {
                    Id = album.Id,
                    Artist = album.Artists?.FirstOrDefault()?.Name ?? "Unknown Artist",
                    Title = album.Name ?? "Unknown Title",
                    Label = album.Label ?? "Unknown Label",
                    ReleaseDate = ParseSpotifyDate(album.ReleaseDate),
                    ImageUrl = album.Images?.FirstOrDefault()?.Url ?? string.Empty,
                    SpotifyUrl = album.ExternalUrls?.Spotify ?? string.Empty,
                    ReleaseType = album.AlbumType ?? "Unknow Release Type",

                    Tracks = album.Tracks?.Items?.Select(t => new TrackDto
                    {
                        Title = t.Name,
                        TrackNumber = t.TrackNumber,
                        SpotifyId = t.Id
                    }).ToList() ?? []
                });
            }
        }

        return releases;
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

    public async Task<IReadOnlyList<ArtistDto>> SearchArtistsAsync(string query, CancellationToken cancellationToken = default)
    {
        await EnsureAccessTokenAsync(cancellationToken);

        var encodedQuery = Uri.EscapeDataString(query);
        var url = $"{_options.BaseUrl}/search?q={encodedQuery}&type=artist&limit=5";

        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

        using var response = await _http.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

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