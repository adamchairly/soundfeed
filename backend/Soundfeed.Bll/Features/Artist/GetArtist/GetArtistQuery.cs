using MediatR;

namespace Soundfeed.Bll.Models;

public class GetArtistQuery : IRequest<GetArtistResponse>
{
    public required int Id { get; init; }
}
