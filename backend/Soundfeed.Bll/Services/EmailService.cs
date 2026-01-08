using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RazorLight;
using SendGrid;
using SendGrid.Helpers.Mail;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Models;
using Soundfeed.Bll.Options;

namespace Soundfeed.Bll.Services;

public class EmailService : IEmailService
{
    private readonly SendGridClient _client;
    private readonly EmailOptions _options;
    private readonly ILogger<EmailService> _logger;
    private readonly IRazorLightEngine _razorEngine;

    public EmailService(IOptions<EmailOptions> options, ILogger<EmailService> logger)
    {
        _options = options.Value;
        _logger = logger;
        _client = new SendGridClient(_options.ApiKey);

        var assembly = System.Reflection.Assembly.GetExecutingAssembly();
        _razorEngine = new RazorLightEngineBuilder()
            .UseEmbeddedResourcesProject(assembly)
            .UseMemoryCachingProvider()
            .Build();
    }

    public async Task SendReleaseDigestAsync(string email, string userName, List<GetReleaseResponse> releases, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey) || string.IsNullOrWhiteSpace(_options.FromEmail))
        {
            _logger.LogWarning("Email service not configured. Skipping email send.");
            return;
        }

        if (releases.Count == 0)
        {
            _logger.LogInformation("No releases to send for {Email}", email);
            return;
        }

        var viewModel = new EmailViewModel
        {
            Releases = releases,
            FeedUrl = _options.FeedUrl,
            LogoUrl = _options.LogoUrl
        };

        var htmlContent = await _razorEngine.CompileRenderAsync("Soundfeed.Bll.Templates.ReleaseDigestEmail.cshtml", viewModel);
        var plainTextContent = BuildEmailPlainText(releases);

        var msg = new SendGridMessage
        {
            From = new EmailAddress(_options.FromEmail, _options.FromName ?? "soundfeed"),
            Subject = $"Weekly digest - {releases.Count} new release{(releases.Count > 1 ? "s" : "")}",
            PlainTextContent = plainTextContent,
            HtmlContent = htmlContent
        };

        msg.AddTo(new EmailAddress(email, userName));

        var response = await _client.SendEmailAsync(msg, cancellationToken);

        if (response.IsSuccessStatusCode)
        {
            _logger.LogInformation("Email sent successfully to {Email}", email);
        }
        else
        {
            var body = await response.Body.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Failed to send email to {Email}. Status: {Status}, Body: {Body}", email, response.StatusCode, body);
        }
    }

    private string BuildEmailPlainText(List<GetReleaseResponse> releases)
    {
        var releasesText = string.Join("\n\n", releases.Select(r =>
        {
            var date = r.ReleaseDate.ToString("MMM d, yyyy");
            var labelInfo = !string.IsNullOrWhiteSpace(r.Label) ? $"\n{r.Label}" : "";

            return $"{r.Title}\n{r.ArtistName}\n{date}{labelInfo}\nListen: {r.SpotifyUrl}";
        }));

        return $"Hello there!\nYour recent releases:\n\n{releasesText}";
    }
}