using Microsoft.EntityFrameworkCore;

namespace BackApi.Entities
{
    public class DataBaseContext:DbContext
    {
        protected readonly IConfiguration Configuration;
        public DataBaseContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseMySql(Configuration.GetConnectionString("MariaDB"),
            ServerVersion.AutoDetect(Configuration.GetConnectionString("MariaDB")));
        }
        //dodatavanje tabela u bazu
        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Dataset> Datasets { get; set; }
        public DbSet<NN> NNs { get; set; }
    }
}
