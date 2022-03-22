namespace BackApi.Models
{
    public class KorisnikLogin
    {
        public string username { get; set; }
        public string password { get; set; }
    }

    public class KorisnikRegister
    {
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string email { get; set; }
        public string username { get; set; }
        public string password { get; set; }

    }

}
