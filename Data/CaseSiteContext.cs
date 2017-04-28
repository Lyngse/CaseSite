using Microsoft.EntityFrameworkCore;

namespace CaseSite.Models
{
    public class CaseSiteContext : DbContext
    {
        public CaseSiteContext (DbContextOptions<CaseSiteContext> options)
            : base(options)
        {
        }

        public DbSet<Job> Job { get; set; }

        public DbSet<CaseSite.Models.Business> Business { get; set; }
    }
}
