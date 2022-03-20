using BackApi.Entities;
using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackApi.Controllers
{
    [Route("api/projects")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        public BazaContext context;
        public IProjectService service;
        public ProjectController(IProjectService service)
        {
            this.service = service;
        }

        [HttpPost]
        public async Task<ActionResult<string>> NoviProjekat([FromBody] ProjectAPI req)
        {
            //POTREBNO IZVADITI USER_ID IZ WEB TOKENA!!!
            Boolean rez;
            rez = service.CreateProject(req);
            if (rez)
                return Ok("Uspesno Kreiran");
            else return BadRequest("Projekat sa ovim imenom vec postoji");
        }

        [HttpDelete("{projid}/delete")]
        public async Task<ActionResult<string>> DeleteProject([FromBody] ProjectAPI req, int projid)
        {
            Boolean rez = service.DeleteProject(projid,req.User_id);
            if (rez)
                return Ok("Projekat izbrisan");
            else return BadRequest("Greska pri brisanju");
        }
    }
}
