using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackApi.Entities
{
    public class NN
    {
        [Key]
        public int NNId { get; set; } 
        public Project Project { get; set; }
        [ForeignKey("Project")]
        public int ProjectId { get; set; }
        public string NNName { get; set; }
        public string DataPath { get; set; }
    }
}
