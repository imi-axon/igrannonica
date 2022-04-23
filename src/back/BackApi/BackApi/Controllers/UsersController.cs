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
        public async Task<ActionResult<string>> Register([FromForm]UserRegister req)
        {
            bool mail = false;
            bool photo = false;
            int userid = jwtsrv.GetUserId();
            if (userid != -1) return Forbid() ;
            string tmp = korsrv.Register(req, out mail);
            if (!mail)
                return BadRequest( new {v = tmp});
            int id = korsrv.UsernameToId(req.username);
            if (req.photo != null)
            {
                photo = korsrv.addPhoto(id, req.photo);
                if(!photo)
                    return BadRequest( new {v = "photo"});
            }
            return Ok(new {v = tmp});
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
                return BadRequest(new {v=rez});
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
            else return NotFound(new {v="projcets"});
        }
        [HttpPost("{username}/changepass")]
        public async Task<ActionResult<string>> SendEmailForChangePass(string username)
        {
            bool tmp = false;
            string res = korsrv.ChangePassword(username, out tmp);
            if(tmp)
                return Ok( new {v = res});
            return BadRequest(new {v=res});
        }

        [HttpPut("{token}/editpassword")]
        public async Task<ActionResult<string>> EditPassword(string token, ActionsPut newpassword)
        {
            bool tmp = false;
            string username = emailsrv.ValidateToken(token);
            if (username != null)
            {
                string message = korsrv.ChangePasswordInDataBase(username, newpassword.actions, out tmp);
                if(tmp)
                    return Ok(new {v=message});
            }
            return BadRequest( new {v="username"});
        }

        [HttpPut("edit/user")]
        public async Task<ActionResult<string>> EditUser(UserEdit user)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            bool pass = korsrv.CheckPass(userid, user.oldpassword1);
            if (!pass)
                return BadRequest(new {v = "password"});
            bool rez = korsrv.EditUser(userid, user);
            if(rez)
                return Ok(new {v="uspesno"});
            return BadRequest(new { v = "username" });
        }

        [HttpPut("edit/email")]
        public async Task<ActionResult<string>> EditEmail(UserEdit user)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            bool pass = korsrv.CheckPass(userid, user.oldpassword2);
            if (!pass)
                return BadRequest(new {v="password"});
            bool rez = korsrv.EditEmail(userid, user);
            if(rez)
                return Ok(new {v="uspesno"});
            return BadRequest(new {v="email"});
        }

        [HttpPut("edit/password")]
        public async Task<ActionResult<string>> EditPass(UserEdit user)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            bool pass = korsrv.CheckPass(userid, user.oldpassword3);
            if (!pass)
                return BadRequest(new { v = "password" });
            bool rez = korsrv.EditPassword(userid, user);
            if(rez)
                return Ok(new {v="uspesno"});
            return BadRequest(new { v = "username" });
        }

        [HttpPut("edit/photo")]
        public async Task<ActionResult<string>> EditPhoto([FromForm]UserEdit user)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            bool pass = korsrv.CheckPass(userid, user.oldpassword3);
            if (!pass)
                return BadRequest(new { v = "password" });
            bool rez = korsrv.EditPhoto(userid, user);
            if (rez)
                return Ok(new { v = "uspesno" });
            return BadRequest(new { v = "username" });
        }
        [HttpGet("{username}/getuser")]
        public async Task<ActionResult<string>> GetUser(string username)
        {
            bool tmp = false;
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();

            string rez = korsrv.GetUser(username, out tmp);
            if(!tmp)
                return BadRequest(new {v=rez});

            return Ok(rez);
        }

        [HttpGet("{username}/getimage")]
        public async Task<ActionResult<dynamic>> GetImage(string username)
        {
            bool tmp = false;
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();

            string photopath = korsrv.UsernameToImagePath(username, out tmp);
            if(!tmp)
                return BadRequest(new {v=photopath});

            if (photopath == "" || photopath==null)
                photopath = "Storage\\profilna.png";

            Byte[] b = System.IO.File.ReadAllBytes(photopath);
            return File(b, "image/jpeg");
        }
        
        [HttpDelete("{username}/delete")]
        public async Task<ActionResult> DeleteUser(string username)
        {
            int loggedid = jwtsrv.GetUserId();
            if (loggedid == -1) return Unauthorized();
            var userid= korsrv.UsernameToId(username);
            if (userid == -1) return NotFound();
            var chk = korsrv.DeleteUser(userid, loggedid);
            if(!chk) return Forbid();

            return Ok(new {v="uspesno"});
        }
    }
}
