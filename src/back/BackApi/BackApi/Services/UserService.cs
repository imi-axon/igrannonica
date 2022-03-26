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
        Boolean Register(UserRegister model);
        string Login(UserLogin model,out Boolean uspeh);
        public int UsernameToId(string username);
    }

    public class UserService: IUserService
    {
        private DataBaseContext kontext;
        private readonly IConfiguration configuration;

        public UserService(DataBaseContext korisnikContext,IConfiguration configuration)
        {
            kontext = korisnikContext;
            this.configuration = configuration;
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

        public Boolean Register(UserRegister model)
        {
            //string rez = "";

            if (kontext.Users.Any(x => x.Username == model.username))
            {
                //rez = "Korisnik sa tim Username-om vec postoji!";
                return false;
            }

            var korisnik= new User();
            korisnik.Username = model.username;
            korisnik.Lastname = model.lastname;
            korisnik.Name=model.firstname;
            korisnik.Email=model.email;

            CreatePWHash(model.password, out byte[] pwHash, out byte[] pwSalt);

            korisnik.PasswordHash=pwHash;
            korisnik.PasswordSalt=pwSalt;

            kontext.Users.Add(korisnik);
            kontext.SaveChanges();
            //rez = "Korisnik uspesno registrovan";

            return true;
        }

        public string Login(UserLogin model,out Boolean uspeh)
        {
            var kor =kontext.Users.FirstOrDefault(x => x.Username == model.username);
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
                return "Pogresan username ili password";
            }
 
        }

        public int UsernameToId(string username)
        {
            var kor = kontext.Users.FirstOrDefault(x => x.Username == username);
            if(kor != null)
                return kor.UserId;
            return -1;
        }
    }
}
