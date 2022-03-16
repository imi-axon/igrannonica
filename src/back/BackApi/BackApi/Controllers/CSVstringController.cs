using BackApi.Entities;
using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace BackApi.Controllers
{
    [Route("api/projects")]
    [ApiController]
    public class CSVstringController : ControllerBase
    {
        public KorisnikContext context;
        public IProjectService service;
        public CSVstringController(IProjectService service)
        {
            this.service = service;
        }
        [HttpPost]
        public async Task<dynamic> Post([FromBody] ProjectAPI project)
        {
            Debug.WriteLine(project.Name+" "+project.Description);
            Boolean response = service.CreateProject(project);
            //Debug.WriteLine(token);
            //var idClaim = User.Claims.FirstOrDefault(x => x.Type.ToString().Equals("id", StringComparison.InvariantCultureIgnoreCase));
            if (response)
                return "USPESNO KREIRAN PROJEKAT";
            return "Projekat sa ovim imenom vec postoji";

            //return project.Name + " " + project.Public + " " + project.Description;
        }
        private string tekst;
        [HttpGet("{id}/dataset")]
        public async Task<ActionResult<dynamic>> Get(int id)
        {
            //Debug.WriteLine(project_id);
            //VADI SE IZ BAZE CSV STRING KOJI ODGOVARA DATOM ID-U
            //UKOLIKO NEMA PROJKETA SA DATIM ID-EM VRACA VRACA NOT FOUND
            //UKOLIKO KORISNIK NIJE ULOGOVAN VRACA UNAUTHORIZED

            tekst = "n1;n2;n3;out\r1; 1; 0; 1\r1; 0; 0; 1\r0; 0; 1; 1\r1; 0; 1; 1\r0; 0; 0; 0\r";
            return Task.Run((Func<Task>)(() => KonekcijaSaML.convertCSVstring(tekst)));
        }
        [HttpPost("{id}/dataset")]
        public async Task<ActionResult<dynamic>> Post(int id, [FromBody] CSVstring content)
        {
            string csvstring;
            csvstring = content.csvstring;
            var response = Task.Run((Func<Task>)(() => KonekcijaSaML.validateCSVstring(csvstring))); 
            //AKO JE RESPONSE SUCCES, POTREBNO JE UPISATI GA U BAZU
            return response;
        }
    }
}
