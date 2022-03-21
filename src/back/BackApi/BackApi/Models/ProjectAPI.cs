namespace BackApi.Models
{
    public class ProjectAPI
    {
        public int? Id { get; set; }
        public int? User_id { get; set; }
        public string Name { get; set; }
        public Boolean Public { get; set; }
        public string Description { get; set; }
    }
}
