using Soundfeed.Bll.Abstractions;
using System.Security.Cryptography;

namespace Soundfeed.Bll;

internal class TokenService : ITokenService
{
    public string GenerateToken(int byteLength = 16)
    {
        var bytes = RandomNumberGenerator.GetBytes(byteLength);
        return Convert.ToBase64String(bytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');
    }
}
