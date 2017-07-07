using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CaseSite.Models
{
    public class UnifactoContext : IdentityDbContext
    {
        public UnifactoContext (DbContextOptions<UnifactoContext> options)
            : base(options)
        {
        }

        public DbSet<Task> Task { get; set; }

        public DbSet<Business> Business { get; set; }
    }
}
