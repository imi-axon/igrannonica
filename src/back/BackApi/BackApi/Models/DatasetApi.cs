namespace BackApi.Models
{
    public class DatasetApi
    {
        public int? DatasetId { get; set; }
        public int? ProjectId { get; set; }
        //public int? OwnerId { get; set; }
        //public Boolean? inQuotes { get; set; }
        //public char? Delimiter { get; set; }
        public string filecontent { get; set; } //sadrzaj fajla prosledjen kao string
        public string? Ext { get; set; } //.csv .json .xml
        //public string Name { get; set; }
    }
}
