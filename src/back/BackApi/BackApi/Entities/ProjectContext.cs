using Microsoft.EntityFrameworkCore;

namespace BackApi.Entities
{
    public class ProjectContext : DbContext
    {
        protected readonly IConfiguration Configuration;
        public ProjectContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(Configuration.GetConnectionString("SqlExpressKorisnici"));
        }
        public DbSet<Project> Projects { get; set; }
    }
}
