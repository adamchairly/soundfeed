using Microsoft.AspNetCore.Mvc;

namespace Soundfeed.Api.Models;

public class BasePaginationRequest
{
    [FromQuery(Name = "page")]
    public int Page { get; set; }

    [FromQuery(Name = "pageSize")]
    public int PageSize { get; set; }

    [FromQuery(Name = "sortDescending")]
    public bool SortDescending { get; set; } = true;
}