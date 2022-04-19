using BackApi.Entities;
using BackApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace BackApi.Services
{
    public interface IUserService
    {
        string Register(UserRegister model);
        string Login(UserLogin model,out Boolean uspeh);
        public int UsernameToId(string username);
        public int EmailToId(string email);
        public string ChangePassword(string username);
        public string ChangePasswordInDataBase(string username, string password);
        public bool CheckPass(int id, string password);
        public bool EditUser(int id, UserEdit model);
        public string GetUser(string username);
        public bool EditEmail(int id, UserEdit model);
        public bool EditPassword(int id, UserEdit model);
        public bool addPhoto(int id, IFormFile photo);
        public string UsernameToImagePath(string username);
        public Boolean DeleteUser(int userid, int loggedid);
    }

    public class UserService : IUserService
    {
        private DataBaseContext kontext;
        private readonly IConfiguration configuration;
        private IEmailService emailService;
        private IStorageService storageService;
        private IProjectService projectService;

        public UserService(DataBaseContext korisnikContext,IConfiguration configuration, IEmailService emailService, IStorageService storageService, IProjectService projectService)
        {
            kontext = korisnikContext;
            this.configuration = configuration;
            this.emailService = emailService;
            this.storageService = storageService;
            this.projectService=projectService;
        }

        private void CreatePWHash(string password, out byte[] pwHash, out byte[] pwSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                pwSalt = hmac.Key;
                pwHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private Boolean CheckPWHash(string password, byte[] pwHash, byte[] pwSalt)
        {
            using (var hmac = new HMACSHA512(pwSalt))
            {
                var izrHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return izrHash.SequenceEqual(pwHash);
            }
        }

        private string CreateToken(User korisnik)
        {
            var punoIme = korisnik.Name + " " + korisnik.Lastname;
            string uid = "" + korisnik.UserId;
            List<Claim> claims = new List<Claim>()
            {
                new Claim("username",korisnik.Username ),
                new Claim("email",korisnik.Email ),
                new Claim("imeprezime",punoIme),
                new Claim("id",uid)
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: cred);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        private string CreateEmailToken(string username, int expiretime)
        {
            List<Claim> claims = new List<Claim>()
            {
                new Claim("username",username),
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings2:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(expiretime),
                signingCredentials: cred);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public string Register(UserRegister model)
        {
            //string rez = "";
            if (kontext.Users.Any(x => (x.Username == model.username && x.Verified == true) || (x.Email == model.email && x.Verified == true)))
            {
                //rez = "Korisnik sa tim Username-om vec postoji!";
                return "Korisnik sa ovim email-om ili username-om vec postoji!";
            }

            else if (kontext.Users.Any(x => (x.Email == model.email && x.Verified == false) || (x.Username == model.username && x.Verified == false)))
            {
                int id1 = UsernameToId(model.username);
                int id2 = EmailToId(model.email);
                int ind1 = 0;
                int ind2 = 0;
                foreach (var user in kontext.Users)
                {
                    if (user.UserId == id1)
                    {
                        string pom = emailService.ValidateToken(user.EmailToken);
                        if (pom != "")
                            return "Korisnik sa ovim username-om treba da se verifikuje, pokusajte za 5min sa ovim ili promenite username";
                        else
                        {
                            ind1 = 1;
                            break;
                        }

                    }
                }

                if (ind1 == 1)
                {
                    var user = kontext.Users.Find(id1);
                    kontext.Users.Remove(user);
                    kontext.SaveChanges();
                }

                foreach (var user in kontext.Users)
                {
                    if (user.UserId == id2)
                    {
                        string pom = emailService.ValidateToken(user.EmailToken);
                        if (pom != "")
                            return "Korisnik sa ovim email-om treba da se verifikuje, pokusajte za 5min sa ovim ili promenite email";
                        else
                        {
                            ind2 = 1;
                            break;
                        }

                    }
                }
                if (ind2 == 1)
                {
                    var user = kontext.Users.Find(id2);
                    kontext.Users.Remove(user);
                    kontext.SaveChanges();
                }
            }
            var korisnik = new User();
            korisnik.Username = model.username;
            korisnik.Lastname = model.lastname;
            korisnik.Name = model.firstname;
            korisnik.Email = model.email;
            korisnik.Verified = false;
            korisnik.PhotoPath = "";
            string jwtoken = CreateEmailToken(korisnik.Username, int.Parse(configuration.GetSection("AppSettings2:EmailToken").Value.ToString()));
            korisnik.EmailToken = jwtoken;

            CreatePWHash(model.password, out byte[] pwHash, out byte[] pwSalt);

            korisnik.PasswordHash = pwHash;
            korisnik.PasswordSalt = pwSalt;

            //var path = storageService.CreateDataset(projid, Dataset.DatasetId);
            kontext.Users.Add(korisnik);
            kontext.SaveChanges();
            //rez = "Korisnik uspesno registrovan";

            emailService.SendEmail("Kliknite na link za potvrdu registracije:http://localhost:4200/verification?token=" + jwtoken, "Potvrda registracije", model.email);
            return "Proverite vas email i verifikujte se";
        }

        public bool addPhoto(int id, IFormFile photo)
        {
            var user = kontext.Users.FirstOrDefault(x => x.UserId == id);
            var path = storageService.CreatePhoto(id);

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            path = path + "\\" + "user"+id+".jpg";
            user.PhotoPath = path;
            kontext.SaveChanges();
            using (FileStream stream = System.IO.File.Create(path))
            {
                photo.CopyTo(stream);
                stream.Flush();
            }
            return true;
        }
        public string Login(UserLogin model,out Boolean uspeh)
        {
            var kor =kontext.Users.FirstOrDefault(x => x.Username == model.username && x.Verified==true);
            var jwtoken = "";

            if (kor != null && CheckPWHash(model.password, kor.PasswordHash, kor.PasswordSalt))
                {            
                        jwtoken = CreateToken(kor);
                        uspeh = true;
                        return jwtoken;
                }
            else
            {
                uspeh = false;
                return "Pogresan username ili password ili korisnik nije verifikovan";
            }
        }

        public string ChangePassword(string username)
        {
            var user = kontext.Users.FirstOrDefault(x=> x.Username == username);
            if (user == null)
                return "Korisnik sa ovim usernam-om ne postoji";
            else
            {
                string jwtoken = CreateEmailToken(user.Username, int.Parse(configuration.GetSection("AppSettings2:EmailToken").Value.ToString()));
                bool res = emailService.SendEmailForPass("Kliknite na link da biste promenili lozinku: http://localhost:4200/changepass?token=" + jwtoken, "Promena lozinke", user.Email);
                return "Proverite vas mail";
            }
        }

        public string ChangePasswordInDataBase(string username, string password)
        {
            var user = kontext.Users.FirstOrDefault(x => x.Username == username);
            if (user == null)
                return "Greska";
            CreatePWHash(password, out byte[] pwHash, out byte[] pwSalt);
            user.PasswordHash = pwHash;
            user.PasswordSalt = pwSalt;
            kontext.SaveChanges();
            return "Uspesno promenjena lozinka";

        }
        public int UsernameToId(string username)
        {
            var kor = kontext.Users.FirstOrDefault(x => x.Username == username);
            if(kor != null)
                return kor.UserId;
            return -1;
        }

        public int EmailToId(string email)
        {
            var kor = kontext.Users.FirstOrDefault(x => x.Email == email);
            if (kor != null)
                return kor.UserId;
            return -1;
        }

        public bool CheckPass(int id, string password)
        {
            var kor = kontext.Users.FirstOrDefault(x => x.UserId == id);
            CreatePWHash(password, out byte[] pwHash, out byte[] pwSalt);
            if (CheckPWHash(password, kor.PasswordHash, kor.PasswordSalt))
                return true;
            return false;
        }

        public bool EditUser(int id, UserEdit model)
        {
            var user = kontext.Users.Find(id);
            if (user == null)
                return false;

            var kor = kontext.Users.FirstOrDefault(x => x.UserId != id && x.Username == model.username);
            if (kor != null)
                return false;

            user.Name = model.firstname;
            user.Lastname = model.lastname;
            user.Username = model.username;

            kontext.SaveChanges();

            return true;

        }

        public bool EditEmail(int id, UserEdit model)
        {
            var user = kontext.Users.Find(id);
            if (user == null)
                return false;

            var kor = kontext.Users.FirstOrDefault(x => x.UserId != id && x.Email==model.email);
            if (kor != null)
                return false;

            user.Email = model.email;
            user.Verified = false;
            string jwtoken = CreateEmailToken(user.Username, int.Parse(configuration.GetSection("AppSettings2:EmailToken").Value.ToString()));
            user.EmailToken = jwtoken;

            kontext.SaveChanges();
            emailService.SendEmail("Kliknite na link za potvrdu registracije:http://localhost:4200/verification?token=" + jwtoken, "Potvrda registracije", model.email);
            return true;

        }
        public bool EditPassword(int id, UserEdit model)
        {
            var user = kontext.Users.Find(id);
            if (user == null)
                return false;

            CreatePWHash(model.newpassword, out byte[] pwHash, out byte[] pwSalt);
            user.PasswordHash = pwHash;
            user.PasswordSalt = pwSalt;
            kontext.SaveChanges();

            return true;

        }
        public string GetUser(string username)
        {
            int id = UsernameToId(username);
            if (id == -1)
                return "";
            var user = kontext.Users.Find(id);
            if (user == null)
                return "";

            var rez = new StringBuilder();
            rez.Append("{");
            rez.Append("\"" + "firstname" + "\":" + "\"" + user.Name + "\",");
            rez.Append("\"" + "lastname" + "\":" + "\"" + user.Lastname + "\",");
            rez.Append("\"" + "username" + "\":" + "\"" + user.Username + "\",");
            rez.Append("\"" + "email" + "\":" + "\"" + user.Email + "\",");
            rez.Append("\"" + "password" + "\":" + "\"" + "" + "\"");
            rez.Append("}");

            return rez.ToString();
        }

        public string UsernameToImagePath(string username)
        {
            int id = UsernameToId(username);
            if (id == -1)
                return "";
            var user = kontext.Users.Find(id);
            if (user == null)
                return "";

            return user.PhotoPath;
        }
        
        public Boolean DeleteUser(int userid,int loggedid)
        {
            if (userid != loggedid)
                return false;
            var tmp=kontext.Users.FirstOrDefault(x=> x.UserId == userid);
            if (tmp == null)
                return false;
            var projs=kontext.Projects.Where(x=> x.UserId == userid).ToList();
            if (projs.Any())
            {
                foreach(var p in projs)
                {
                    projectService.DeleteProject(p.ProjectId, userid);
                }

                kontext.Users.Remove(tmp);
                kontext.SaveChanges();
                return true;
            }
            return true;
        }
    }
}
