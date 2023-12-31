﻿using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net;

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
            int userid = jwtsrv.GetUserId();
            if (userid != -1) return Forbid();
            string tmp = korsrv.Register(req);
            int id = korsrv.UsernameToId(req.username);
            if(req.photo!=null)
                korsrv.addPhoto(id, req.photo);
            if (tmp != "")
                return BadRequest(tmp);
            return Ok();
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
        [HttpGet("public_projects")]
        public async Task<ActionResult<string>> GetPublicProjcets()
        {
            var rez = projsrv.ListPublicProjects();
            if (rez != "[]")
                return Ok(rez);
            else
                return NotFound("Nema public projekata");
        }
        [HttpPost("{username}/changepass")]
        public async Task<ActionResult<string>> SendEmailForChangePass(string username)
        {
            string res = korsrv.ChangePassword(username);
            return Ok();
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

        [HttpPut("edit/photo")]
        public async Task<ActionResult<string>> EditPhoto([FromForm]UserEdit user)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            bool pass = korsrv.CheckPass(userid, user.oldpassword3);
            if (!pass)
                return "NESTO NIJE U REDU";
            bool rez = korsrv.EditPhoto(userid, user);
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

        [HttpGet("{username}/getimage")]
        public async Task<ActionResult<dynamic>> GetImage(string username)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();

            string photopath = korsrv.UsernameToImagePath(username);
            if (photopath == "" || photopath==null)
                photopath = Path.Combine("Storage", "profilna.png");

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


            return Ok();
        }

        [HttpGet("nns")]
        public async Task<ActionResult> NNsInTraining()
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();

            var resp = await MLconnection.NNsInTrainList(userid);
            if (resp.StatusCode == HttpStatusCode.OK)
            {
                return Ok(resp.Content);
            }
            else return BadRequest();
        }
    }
}
