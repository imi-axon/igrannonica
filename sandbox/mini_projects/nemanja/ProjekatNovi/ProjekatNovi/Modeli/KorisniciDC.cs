using Microsoft.EntityFrameworkCore;

namespace ProjekatNovi.Modeli
{
    public class KorisniciDC:DbContext
    {
        public KorisniciDC(DbContextOptions<KorisniciDC> opcije):base(opcije) 
        {

        }

        public DbSet<KorisnikDetalji> KorisnikDetalji { get; set; }
    }
}
