namespace BackApi
{
    public class CSVstring
    {
        public int projectId { get; set; }
        public int? ownerId { get; set; }
        public char? delimiter { get; set; }
        public Boolean? inQuotes { get; set; }
        public string csvstring { get; set; } = string.Empty;
    }
}
