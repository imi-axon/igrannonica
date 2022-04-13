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

        [HttpGet("{emailtoken}")]
        public async Task<ActionResult<string>> Verify(string emailtoken)
        {
            string pom = emailsrv.ValidateToken(emailtoken);
            if (pom != null)
            {
                string message = emailsrv.VerifyEmailAdress(pom);
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost]
        public async Task<ActionResult<string>> Register(UserRegister req/*, IFormFile photo*/)
        {
            int userid = jwtsrv.GetUserId();
            if (userid != -1) return Forbid();
            string tmp = korsrv.Register(req);
            int id = korsrv.UsernameToId(req.username);
            //korsrv.addPhoto(1, photo);
            string rez = "";
            if (tmp != "")
            {
                return tmp;
                //rez = "Korisnik uspesno registrovan(nije verifikovan)";
                //return Ok(rez);
            }
            else
            {
                rez = "Korisnik sa tim Username-om vec postoji!";
                return BadRequest(rez);
            }
            return rez;
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
            var rez = projsrv.ListProjects(userid, pubuserid);
            if (rez != "[]")
                return Ok(rez);
            else return NotFound("Korisnik sa tim username-om nema projekte");
        }
        [HttpPost("{username}/changepass")]
        public async Task<ActionResult<string>> SendEmailForChangePass(string username)
        {
            string res = korsrv.ChangePassword(username);
            return res;
        }

        [HttpPut("{token}/editpassword")]
        public async Task<ActionResult<string>> EditPassword(string token, ActionsPut newpassword)
        {
            string username = emailsrv.ValidateToken(token);
            if (username != null)
            {
                string message = korsrv.ChangePasswordInDataBase(username, newpassword.actions);
                return Ok();
            }
            return BadRequest();
        }

        [HttpPut("edit/user")]
        public async Task<ActionResult<string>> EditUser(UserEdit user)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            bool pass = korsrv.CheckPass(userid, user.oldpassword1);
            if (!pass)
                return "nESTO NIJE U REDU";
            bool rez = korsrv.EditUser(userid, user);
            return Ok();
        }

        [HttpPut("edit/email")]
        public async Task<ActionResult<string>> EditEmail(UserEdit user)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            bool pass = korsrv.CheckPass(userid, user.oldpassword2);
            if (!pass)
                return "NESTO NIJE U REDU";
            bool rez = korsrv.EditEmail(userid, user);
            return Ok();
        }

        [HttpPut("edit/password")]
        public async Task<ActionResult<string>> EditPass(UserEdit user)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            bool pass = korsrv.CheckPass(userid, user.oldpassword3);
            if (!pass)
                return "NESTO NIJE U REDU";
            bool rez = korsrv.EditPassword(userid, user);
            return Ok();
        }
        [HttpGet("{username}/getuser")]
        public async Task<ActionResult<string>> GetUser(string username)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();

            string rez = korsrv.GetUser(username);
            if(rez=="")
                return BadRequest();

            return rez;
        }
    }
}
