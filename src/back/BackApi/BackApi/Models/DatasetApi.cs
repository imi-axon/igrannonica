namespace BackApi.Models
{
    public class DatasetApi
    {
        public int? DatasetId { get; set; }
        public int ProjectId { get; set; }
        public int OwnerId { get; set; }
        public Boolean? inQuotes { get; set; }
        public char? Delimiter { get; set; }
        public IFormFile formFile { get; set; }
        public string Ext { get; set; } //.csv .json .xml
    }
}
