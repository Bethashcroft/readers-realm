using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ReadersRealm.Api.Models;

namespace ReadersRealm.Api.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }

    public DbSet<Book> Books {get; set;}
    public DbSet<Review> Reviews {get; set;}
    public DbSet<BorrowRequest> BorrowRequests {get; set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<BorrowRequest>().HasOne(b => b.FromUser).WithMany().HasForeignKey(b => b.FromUserId).OnDelete(DeleteBehavior.NoAction);

        builder.Entity<BorrowRequest>().HasOne(b => b.ToUser).WithMany().HasForeignKey(b => b.ToUserId).OnDelete(DeleteBehavior.NoAction);
        builder.Entity<Review>()
        .HasOne(r => r.Book)
        .WithMany()
        .HasForeignKey(r => r.BookId)
        .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}