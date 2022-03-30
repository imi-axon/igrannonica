using BackApi.Entities;
using BackApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace BackApi.Services
{
    public interface IUserService
    {
        string Register(UserRegister model);
        string Login(UserLogin model,out Boolean uspeh);
        public int UsernameToId(string username);
        public int EmailToId(string email);
    }

    public class UserService: IUserService
    {
        private DataBaseContext kontext;
        private readonly IConfiguration configuration;
        private IEmailService emailService;

        public UserService(DataBaseContext korisnikContext,IConfiguration configuration, IEmailService emailService)
        {
            kontext = korisnikContext;
            this.configuration = configuration;
            this.emailService = emailService;
        }

        private void CreatePWHash(string password, out byte[] pwHash, out byte[] pwSalt)
        {
            using(var hmac=new HMACSHA512())
            {
                pwSalt = hmac.Key;
                pwHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private Boolean CheckPWHash(string password,byte[] pwHash,byte[] pwSalt)
        {
            using (var hmac = new HMACSHA512(pwSalt))
            {
                var izrHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
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
            var jwt=new JwtSecurityTokenHandler().WriteToken(token);
                return jwt;
        }

        private string CreateEmailToken(User korisnik, int expiretime)
        {
            List<Claim> claims = new List<Claim>()
            {
                new Claim("username",korisnik.Username ),
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings:Token").Value));

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
                foreach(var user in kontext.Users)
                {
                    if(user.UserId == id1)
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

                if(ind1 == 1)
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
            var korisnik= new User();
            korisnik.Username = model.username;
            korisnik.Lastname = model.lastname;
            korisnik.Name=model.firstname;
            korisnik.Email=model.email;
            korisnik.Verified = false;
            string jwtoken = CreateEmailToken(korisnik, int.Parse(configuration.GetSection("AppSettings2:EmailToken").Value.ToString()));
            korisnik.EmailToken = jwtoken; 

            CreatePWHash(model.password, out byte[] pwHash, out byte[] pwSalt);

            korisnik.PasswordHash=pwHash;
            korisnik.PasswordSalt=pwSalt;

            kontext.Users.Add(korisnik);
            kontext.SaveChanges();
            //rez = "Korisnik uspesno registrovan";

            emailService.SendEmail("Kliknite na link za potvrdu registracije:http://localhost:4200/verification?token=" + jwtoken, "Potvrda registracije", model.email);
            return "Proverite vas email i verifikujte se";
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
    }
}
