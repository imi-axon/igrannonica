using BackApi.Entities;
using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        public BazaContext context;
        public IProjectService service;
        public ProjectController(IProjectService service)
        {
            this.service = service;
        }

        [HttpPost("noviproj")]
        public async Task<ActionResult<string>> NoviProjekat(ProjectAPI req)
        {
            Boolean rez;
            rez = service.CreateProject(req);
            if (rez)
                return Ok("Uspesno Kreiran");
            else return BadRequest("Neka Greska");
        }

        [HttpDelete("{projid}/delete")]
        public async Task<ActionResult<string>> DeleteProject(ProjectAPI req, int projid)
        {
            Boolean rez = service.DeleteProject(projid,req.User_id);
            if (rez)
                return Ok("xd");
            else return BadRequest("Greska pri brisanju");
        }

        [HttpGet("{projid}")]
        public async Task<ActionResult<string>> GetProjById(int projid,int userid)
        {
            var rez = service.GetProjById(projid, userid);
            if (rez != "")
                return Ok(rez);
            else return NotFound();
        }
        [HttpGet]
        public async Task<ActionResult<string>> ListProjects(int userid)
        {
            var rez = service.ListProjects(userid);
            if (rez != "[]")
                return Ok(rez);
            else return NotFound();
        }

        [HttpPut("{projid}")]
        public async Task<ActionResult<string>> EditProject(int projid,ProjectAPI req)
        {
            Boolean rez = service.EditProject(projid,req);
            if (rez)
                return Ok("Uspesno Izmenjeni Detalji");
            else return NotFound();
        }
    }
}
