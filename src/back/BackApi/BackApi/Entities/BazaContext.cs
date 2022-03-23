using Microsoft.EntityFrameworkCore;

namespace BackApi.Entities
{
    public class BazaContext:DbContext
    {
        protected readonly IConfiguration Configuration;
        public BazaContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(Configuration.GetConnectionString("SqlExpress"));
        }
        //dodatavanje tabela u bazu
        public DbSet<Korisnik> Korisnici { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Dataset> Datasets { get; set; }
        public DbSet<NN> NNs { get; set; }
    }
}
