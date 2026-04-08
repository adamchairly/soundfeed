using Microsoft.EntityFrameworkCore;
using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Extensions;

public static class PaginationExtension
{
    public static async Task<PageResult<T>> ToPageResultAsync<T>(this IQueryable<T> source, int page, int pageSize, CancellationToken cancellationToken = default) where T : class
    {
        ArgumentNullException.ThrowIfNull(source, nameof(source));

        const int maxPageSize = 100;
        const int maxPage = 10_000;

        if (page <= 0) page = 1;
        if (page > maxPage) page = maxPage;
        if (pageSize <= 0) pageSize = 10;
        if (pageSize > maxPageSize) pageSize = maxPageSize;

        var totalCount = await source.CountAsync(cancellationToken);

        var items = await source
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PageResult<T>(totalCount, page, pageSize, items);
    }
}