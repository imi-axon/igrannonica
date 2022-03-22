namespace BackApi.Models
{
    public class DatasetGetPost
    {
        public string filecontent { get; set; } //sadrzaj fajla prosledjen kao string
        //public string Ext { get; set; } //.csv .json .xml - u koliko se implentuje filtype support
        //public string Name { get; set; } // ukoliko se implementuje vise datasetova po projectu
    }
}
