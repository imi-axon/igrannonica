using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BackApi.Controllers
{
    [Route("api/projects")]
    [ApiController]
    public class DatasetController : ControllerBase
    {
        private IDatasetServis datasrv;
        public DatasetController(IDatasetServis datasetServis)
        {
            datasrv = datasetServis;
        }

        [HttpGet("{id}/dataset")]
        public async Task<ActionResult<dynamic>> Get(int id)
        {
            //UKOLIKO KORISNIK NIJE ULOGOVAN VRACA UNAUTHORIZED
            Boolean uspeh;
            string pom = datasrv.daLiPostoji(id, out uspeh);
            if(!uspeh)
                return NotFound(pom);
            
            //string tekst = "n1;n2;n3;out\r1; 1; 0; 1\r1; 0; 0; 1\r0; 0; 1; 1\r1; 0; 1; 1\r0; 0; 0; 0\r";
            var response = await KonekcijaSaML.convertCSVstring(pom);

            return await response.Content.ReadAsStringAsync();
        }
        [HttpPost("{id}/dataset")]
        public async Task<ActionResult<dynamic>> NewDataSet(int id, [FromBody] DatasetApi req)
        {
            var response = await KonekcijaSaML.validateCSVstring(req.filecontent);

            if (response.StatusCode == HttpStatusCode.Created)
            {
                datasrv.Novi(req, id);
                return StatusCode(StatusCodes.Status200OK, new { message = "Sve je u redu." });
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ne valja CSV." });
        }
    }
}
