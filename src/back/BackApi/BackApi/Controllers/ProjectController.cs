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
        private IJwtService jwtsrv;
        public ProjectController(IProjectService service,IJwtService jwtServis)
        {
            this.service = service;
            this.jwtsrv = jwtServis;
        }

        [HttpPost]
        public async Task<ActionResult<string>> NewProject([FromBody] ProjectPostPut req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            bool rez;
            rez = service.CreateProject(req,userid);
            int id = service.getProjectId(req);
            if (rez)
                return id+"";
            else return BadRequest(new { v = "project" });
        }

        [HttpDelete("{projid}/delete")]
        public async Task<ActionResult<string>> DeleteProject(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            Boolean rez = service.DeleteProject(projid,userid);
            if (rez)
                return Ok(new {v="uspesno"});
            else return BadRequest(new {v="projcet"});
        }

        [HttpGet("{projid}")]
        public async Task<ActionResult<string>> GetProjectById(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var rez = service.GetProjById(projid, userid);
            if (rez != "")
                return Ok(rez);
            else return NotFound(new {v="project"});
        }
        [HttpGet]
        public async Task<ActionResult<string>> ListProjects()
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var rez = service.ListProjects(userid,userid);
            if (rez != "[]")
                return Ok(rez);
            else return NotFound(new {v="projcet"});
        }

        [HttpPut("{projid}")]
        public async Task<ActionResult<string>> EditProject(int projid,ProjectPostPut req)
        {
            bool tmp = false;
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            string rez = service.EditProject(projid,req,userid, out tmp);
            if (tmp)
                return Ok(new {v=rez});
            else return NotFound(new { v = rez });
        }
    }
}
