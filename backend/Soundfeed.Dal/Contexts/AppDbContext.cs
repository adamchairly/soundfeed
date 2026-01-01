using Microsoft.EntityFrameworkCore;
using Soundfeed.Dal.Abstractions;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Dal;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Artist> Artists { get; set; }
    public DbSet<Release> Releases { get; set; }
    public DbSet<UserSubscription> UserSubscriptions { get; set; }
    public DbSet<Track> Tracks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<Artist>()
            .HasIndex(a => a.SpotifyArtistId)
            .IsUnique();

        modelBuilder.Entity<Release>()
            .HasIndex(r => new { r.ArtistId, r.SpotifyReleaseId })
            .IsUnique();

        modelBuilder.Entity<UserSubscription>()
            .HasIndex(us => new { us.UserId, us.ArtistId })
            .IsUnique();

        modelBuilder.Entity<Track>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.HasOne(t => t.Release)
                .WithMany(r => r.Tracks)
                .HasForeignKey(t => t.ReleaseId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(t => new { t.ReleaseId, t.TrackNumber });
        });
    }
}
