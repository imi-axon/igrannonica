using Microsoft.EntityFrameworkCore;

namespace BackApi.Entities
{
    public class KorisnikContext:DbContext
    {
        protected readonly IConfiguration Configuration;
        public KorisnikContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(Configuration.GetConnectionString("SqlExpressKorisnici"));
        }
        public DbSet<Korisnik> Korisnici { get; set; }
    }
}
