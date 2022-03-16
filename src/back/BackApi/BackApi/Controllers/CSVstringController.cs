using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Diagnostics;

namespace BackApi.Controllers
{
    [Route("api/projects")]
    [ApiController]
    public class CSVstringController : ControllerBase
    {
        [HttpGet("{id}/dataset")]
        public async Task<ActionResult<dynamic>> Get(int id)
        {
            //Debug.WriteLine(project_id);
            //VADI SE IZ BAZE CSV STRING KOJI ODGOVARA DATOM ID-U
            //UKOLIKO NEMA PROJKETA SA DATIM ID-EM VRACA VRACA NOT FOUND
            //UKOLIKO KORISNIK NIJE ULOGOVAN VRACA UNAUTHORIZED

            string tekst = "n1;n2;n3;out\r1; 1; 0; 1\r1; 0; 0; 1\r0; 0; 1; 1\r1; 0; 1; 1\r0; 0; 0; 0\r";
            return await KonekcijaSaML.convertCSVstring(tekst);
        }

        [HttpPost("{id}/dataset")]
        public async Task<ActionResult<dynamic>> Post(int id, [FromBody] CSVstring content)
        {
            string csvstring;
            csvstring = content.csvstring;
            Debug.WriteLine(csvstring);
            var response = await KonekcijaSaML.validateCSVstring(csvstring);
            //var response = Task.Run((Func<Task>)(() => KonekcijaSaML.validateCSVstring(csvstring))); 
            //AKO JE RESPONSE SUCCES, POTREBNO JE UPISATI GA U BAZU

            if (response.StatusCode == HttpStatusCode.Created)
                return StatusCode(StatusCodes.Status201Created, new { message = "Sve je u redu." });

            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ne valja CSV." });
        }
    }
}
