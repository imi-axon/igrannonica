namespace BackApi.Models
{
    public class ApiNNTempCreate
    {
        public string Name { get; set; }
    }

    public class ApiNNCfg
    {
        public string conf { get; set; }//json string
    }
    public class ApiNNTrain
    {
        public string dataset { get; set; }
        public string nn { get; set; }
        public string conf { get; set; }
    }
}
