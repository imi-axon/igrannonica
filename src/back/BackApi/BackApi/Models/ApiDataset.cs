namespace BackApi.Models
{
    public class DatasetGetPost
    {
        public string dataset { get; set; } //sadrzaj fajla prosledjen kao string
        //public string Ext { get; set; } //.csv .json .xml - u koliko se implentuje filtype support
        //public string Name { get; set; } // ukoliko se implementuje vise datasetova po projectu
    }

    public class DatasetMLPost
    {
        public string dataset { get; set; }
        public string actions { get; set; }
    }

    public class ActionsPut
    {
        public string actions { get; set; }
    }
}
