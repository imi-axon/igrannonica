using Microsoft.EntityFrameworkCore;

namespace NoviRaspored.Models
{
    public class ZadatakContext:DbContext
    {
        public ZadatakContext(DbContextOptions<ZadatakContext> options) : base(options)
        {

        }

        public DbSet<Zadatak> Rasporeds { get; set; }
    }
}
