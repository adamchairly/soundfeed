using Microsoft.EntityFrameworkCore;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Dal.Abstractions;

public interface IAppDbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Artist> Artists { get; set; }
    public DbSet<Release> Releases { get; set; }
    public DbSet<UserSubscription> UserSubscriptions { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
