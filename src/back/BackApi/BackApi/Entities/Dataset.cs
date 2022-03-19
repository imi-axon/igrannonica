using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackApi.Entities
{
    public class Dataset
    {
        [Key]
        public int DatasetId { get; set; }
        public Project Project { get; set; }
        [ForeignKey("Project")]
        public int ProjectId { get; set; }
        public Korisnik Korisnik { get; set; }
        [ForeignKey("Korisnik")]
        public int OwnerId  { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public int? Main { get; set; }
        public Boolean? inQuotes { get; set; }
        public char? Delimiter { get; set; }
        public string Ext { get; set; } //.csv .json .xml
    }
}
