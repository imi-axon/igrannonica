using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BackApi.Entities
{
    public class Comments
    {
        [Key]
        public int Id { get; set; }
        public int Userid { get; set; }
        public int ParentId {get; set; }
        public int ProjectId { get; set; }
        public string Comment { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
