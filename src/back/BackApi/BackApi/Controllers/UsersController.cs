using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace BackApi.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUserService korsrv;
        private IJwtService jwtsrv;
        private IProjectService projsrv;
        private IConfiguration configuration;
        private IEmailService emailsrv;

        public UsersController(IUserService korisnikServis, IJwtService jwtServis, IProjectService projectService, IConfiguration configuration, IEmailService emailService)
        {
            this.korsrv = korisnikServis;
            this.jwtsrv = jwtServis;
            this.projsrv = projectService;
            this.configuration = configuration;
            this.emailsrv = emailService;
        }

        [HttpPost("{emailtoken}")]
        public async Task<ActionResult<string>> Verify(string emailtoken)
        {
            string pom = emailsrv.ValidateToken(emailtoken);
            if (pom != null)
            {
                string message = emailsrv.VerifyEmailAdress(pom);
                return Ok(message);
            }
            return BadRequest();
        }

        [HttpPost]
        public async Task<ActionResult<string>> Register(UserRegister req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid != -1) return Forbid();
            Boolean tmp = korsrv.Register(req);
            string rez = "";
            if (tmp)
            {
                rez = "Korisnik uspesno registrovan(nije verifikovan)";
                return Ok(rez);
            }
            else
            {
                rez = "Korisnik sa tim Username-om vec postoji!";
                return BadRequest(rez);
            }
        }
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserLogin req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid != -1) return Forbid();
            Boolean uspeh;
            var rez = korsrv.Login(req, out uspeh);
            if (uspeh)
                return Ok(new
                {
                     v = rez

                });   
            else
                return BadRequest(rez);
        }
        [HttpGet("{username}/projects")]
        public async Task<ActionResult<string>> ListProjects(string username)
        {
            int userid = jwtsrv.GetUserId();
            var pubuserid = korsrv.UsernameToId(username);
            if (pubuserid == -1)
                return NotFound("Korisnik sa tim username-om ne postoji");
            var rez = projsrv.ListProjects(userid,pubuserid);
            if (rez != "[]")
                return Ok(rez);
            else return NotFound("Korisnik sa tim username-om nema projekte");
        }
    }
}
