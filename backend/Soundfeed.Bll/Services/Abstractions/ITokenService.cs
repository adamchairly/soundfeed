namespace Soundfeed.Bll.Abstractions;

public interface ITokenService
{
    string GenerateToken(int byteLength = 16);
}
