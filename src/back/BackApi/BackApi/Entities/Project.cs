using System.ComponentModel.DataAnnotations;

namespace BackApi.Entities
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        public int User_id { get; set; }    
        public string Name { get; set; }
        public DateTime Creation_Date { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
