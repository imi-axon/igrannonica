﻿namespace BackApi.Models
{
    public class KorisnikLogin
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class KorisnikRegister
    {
        public string Name { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

    }

}
