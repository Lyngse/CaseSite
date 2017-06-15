using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CaseSite.Models
{
    public class CaseSiteContext : IdentityDbContext
    {
        public CaseSiteContext (DbContextOptions<CaseSiteContext> options)
            : base(options)
        {
        }

        public DbSet<Job> Job { get; set; }

        public DbSet<Business> Business { get; set; }
    }
}
