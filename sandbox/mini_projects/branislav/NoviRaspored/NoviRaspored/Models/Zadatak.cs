using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NoviRaspored.Models
{
    public class Zadatak
    {
        [Key]
        public int zadId { get; set; }

        [Column(TypeName = "nvarchar(64)")]
        public string Naziv { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        public string Opis { get; set; }

        [Column(TypeName = "nvarchar(5)")]
        public string Vreme { get; set; }

        [Column(TypeName = "nvarchar(16)")]
        public string Dan { get; set; }
    }
}
