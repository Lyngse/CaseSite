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

        public DbSet<Student> Student { get; set; }

        public DbSet<Solution> Solution { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Task>()
                .HasMany(p => p.Solutions)
                .WithOne(i => i.Task)
                .HasForeignKey(s => s.TaskId);

            modelBuilder.Entity<Task>()
                .HasOne(p => p.WinnerSolution);

            base.OnModelCreating(modelBuilder);
        }
    }
}
