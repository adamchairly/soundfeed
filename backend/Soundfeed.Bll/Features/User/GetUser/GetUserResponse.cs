namespace Soundfeed.Bll.Models;

public sealed class GetUserResponse
{
    public string RecoveryCode { get; set; } = string.Empty;
    public string? Email { get; set; }
    public bool EmailNotifications { get; set; }
}
