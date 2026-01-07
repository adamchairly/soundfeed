namespace Soundfeed.Bll.Models;

public class PageResult<T>
{
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public List<T> Items { get; set; } = new();

    public PageResult(int totalCount, int page, int pageSize, List<T> items)
    {
        TotalCount = totalCount;
        Page = page;
        PageSize = pageSize;
        Items = items;
    }
}