using MediatR;
using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Features;

public sealed class GetStatsQuery : IRequest<GetStatsResponse>
{
}
