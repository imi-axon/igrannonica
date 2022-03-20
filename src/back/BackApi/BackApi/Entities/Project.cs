using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackApi.Entities
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        public Korisnik Korisnik { get; set; }
        [ForeignKey("Korisnik")]
        public int User_id { get; set; }
        public string Name { get; set; }
        public DateTime Creation_Date { get; set; }
        public string Description { get; set; } = string.Empty;

        public Boolean Public { get; set; } = false;
    }
}
