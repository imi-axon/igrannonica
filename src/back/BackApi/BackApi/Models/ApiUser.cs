﻿namespace BackApi.Models
{
    public class UserLogin
    {
        public string username { get; set; }
        public string password { get; set; }
    }

    public class UserPhoto
    {
        public IFormFile photo { get; set; }
    }

    public class UserRegister
    {
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string email { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public IFormFile? photo { get; set; }
    }

    public class UserEdit
    {
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string email { get; set; }
        public string username { get; set; }
        public string oldpassword1 { get; set; }
        public string oldpassword2 { get; set; }
        public string oldpassword3 { get; set; }
        public string oldpassword4 { get; set; }
        public string newpassword { get; set; }
        public IFormFile? photo { get; set; }

    }

}
