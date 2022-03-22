﻿using BackApi.Entities;
using BackApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace BackApi.Services
{
    public interface IKorisnikServis
    {
        Boolean Register(KorisnikRegister model);
        string Login(KorisnikLogin model,out Boolean uspeh);
        public int UsernameToId(string username);
    }

    public class KorisnikServis: IKorisnikServis
    {
        private BazaContext kontext;
        private readonly IConfiguration configuration;

        public KorisnikServis(BazaContext korisnikContext,IConfiguration configuration)
        {
            kontext = korisnikContext;
            this.configuration = configuration;
        }

        private void KreirajPWHash(string password, out byte[] pwHash, out byte[] pwSalt)
        {
            using(var hmac=new HMACSHA512())
            {
                pwSalt = hmac.Key;
                pwHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private Boolean ProveriPWHash(string password,byte[] pwHash,byte[] pwSalt)
        {
            using (var hmac = new HMACSHA512(pwSalt))
            {
                var izrHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return izrHash.SequenceEqual(pwHash);
            }
        }

        private string KreirajToken(Korisnik korisnik)
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

        public Boolean Register(KorisnikRegister model)
        {
            //string rez = "";

            if (kontext.Korisnici.Any(x => x.Username == model.Username))
            {
                //rez = "Korisnik sa tim Username-om vec postoji!";
                return false;
            }

            var korisnik= new Korisnik();
            korisnik.Username = model.Username;
            korisnik.Lastname = model.Lastname;
            korisnik.Name=model.Name;
            korisnik.Email=model.Email;

            KreirajPWHash(model.Password, out byte[] pwHash, out byte[] pwSalt);

            korisnik.PasswordHash=pwHash;
            korisnik.PasswordSalt=pwSalt;

            kontext.Korisnici.Add(korisnik);
            kontext.SaveChanges();
            //rez = "Korisnik uspesno registrovan";

            return true;
        }

        public string Login(KorisnikLogin model,out Boolean uspeh)
        {
            var kor =kontext.Korisnici.FirstOrDefault(x => x.Username == model.Username);
            var jwtoken = "";

            if (kor != null && ProveriPWHash(model.Password, kor.PasswordHash, kor.PasswordSalt))
                {            
                        jwtoken = KreirajToken(kor);
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
            var kor = kontext.Korisnici.FirstOrDefault(x => x.Username == username);
            if(kor != null)
                return kor.UserId;
            return -1;
        }
    }
}
