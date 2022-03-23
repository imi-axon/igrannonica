using BackApi.Entities;
using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackApi.Controllers
{
    [Route("api/projects")]
    [ApiController]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private IProjectService service;
        private IJwtServis jwtsrv;
        public ProjectController(IProjectService service,IJwtServis jwtServis)
        {
            this.service = service;
            this.jwtsrv = jwtServis;
        }

        [HttpPost]
        public async Task<ActionResult<string>> NoviProjekat([FromBody] ProjectPostPut req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            Boolean rez;
            rez = service.CreateProject(req,userid);
            if (rez)
                return Ok();
            else return BadRequest();
        }

        [HttpDelete("{projid}/delete")]
        public async Task<ActionResult<string>> DeleteProject(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            Boolean rez = service.DeleteProject(projid,userid);
            if (rez)
                return Ok("Projekat izbrisan");
            else return BadRequest("Greska pri brisanju");
        }

        [HttpGet("{projid}")]
        public async Task<ActionResult<string>> GetProjById(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var rez = service.GetProjById(projid, userid);
            if (rez != "")
                return Ok(rez);
            else return NotFound();
        }
        [HttpGet]
        public async Task<ActionResult<string>> ListProjects()
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var rez = service.ListProjects(userid,userid);
            if (rez != "[]")
                return Ok(rez);
            else return NotFound();
        }

        [HttpPut("{projid}")]
        public async Task<ActionResult<string>> EditProject(int projid,ProjectPostPut req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            Boolean rez = service.EditProject(projid,req,userid);
            if (rez)
                return Ok("Uspesno Izmenjeni Detalji");
            else return NotFound("Projekat ne postoji ili vi niste vlasnik");
        }
    }
}
