using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjekatNovi.Modeli
{
    public class KorisnikDetalji
    {
        [Key]
        public int IDkorisnika { get; set; }

        [Column(TypeName ="nvarchar(100)")]
        public string Imeiprezime { get; set; }

        [Column(TypeName = "nvarchar(9)")]
        public string Brojlicnekarte { get; set; }

        [Column(TypeName = "nvarchar(10)")]
        public string Tribina { get; set; }

    }
}
