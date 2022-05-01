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
        public string newconf { get; set; }
    }
    public class NNCreate
    {
        public string headers { get; set; }
        public string nn { set; get; }
        public string conf { set; get; }
    }

    public class ApiNNGet
    {
        public string nn { set; get; }
        public string conf { get; set; }
    }
    public class ApiNNPost
    {
        public string nn { set; get; }
    }

    public class ApiNNPutNote
    {
        public string note { set; get; }
    }
}
