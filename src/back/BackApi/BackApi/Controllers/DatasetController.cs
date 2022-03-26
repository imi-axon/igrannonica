using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net;

namespace BackApi.Controllers
{
    [Route("api/projects")]
    [ApiController]
    [Authorize]
    public class DatasetController : ControllerBase
    {
        private IDatasetService datasrv;
        private IJwtService jwtsrv;
        public DatasetController(IDatasetService datasetServis, IJwtService jwtServis)
        {
            this.datasrv = datasetServis;
            this.jwtsrv = jwtServis;
        }

        /*
        [HttpGet("{id}/dataset")]
        public async Task<ActionResult<dynamic>> Get(int id)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            Boolean uspeh;
            Boolean owner;
            string pom = datasrv.daLiPostoji(id, out uspeh,userid,out owner);
            if(!uspeh)
                return NotFound(pom);
            if (!owner)
                return Forbid(pom);

            //string tekst = "n1;n2;n3;out\r1; 1; 0; 1\r1; 0; 0; 1\r0; 0; 1; 1\r1; 0; 1; 1\r0; 0; 0; 0\r";
            DatasetGetPost dataset = new DatasetGetPost();
            dataset.dataset = pom;
            var response = await KonekcijaSaML.convertCSVstring(dataset);

            return await response.Content.ReadAsStringAsync();
        }
        */
        
        [HttpPost("{id}/dataset")]
        public async Task<ActionResult<string>> NewDataSet(int id, [FromBody] DatasetGetPost req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var response = await MLconnection.validateCSVstring(req);

            if (response.StatusCode == HttpStatusCode.Created)
            {
                var chk=datasrv.New(req, id,userid);
                if (chk)
                    return StatusCode(StatusCodes.Status200OK, new { message = "Sve je u redu." });
                else return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ne valja CSV." });
        }

        [HttpDelete("{projid}")]
        public async Task<ActionResult<string>> DeleteDataset(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var rez = datasrv.Delete(projid,userid);
            if (rez)
                return Ok("Uspesno Obrisan");
            else return BadRequest("Vec obrisan ili vi niste vlasnik projekta");
        }

        /*[HttpGet("{projid}")]
        public async Task<ActionResult<string>> ListajDataset(int projid)
        {
            var rez = datasrv.Listaj(projid);
            if (rez != "[]")
                return Ok(rez);
            else return NotFound("Ne postoji dataset");
        }*/

        [HttpGet("{projid}/dataset")]
        public async Task<ActionResult<dynamic>> ReadDataset(int projid,Boolean main)
        {
            var rez = datasrv.Read(projid,main);
            if (rez != null)
            {
                DatasetGetPost dataset = new DatasetGetPost();
                dataset.dataset = rez;
                var response = await MLconnection.convertCSVstring(dataset);

                return await response.Content.ReadAsStringAsync();
            }
            else return NotFound("Ne postoji dataset");
        }

        [HttpGet("{id}/dataset/{main}/statistics")]
        public async Task<ActionResult<string>> GetStatistics(int id, Boolean main)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            
            DatasetGetPost dataset = new DatasetGetPost();
            dataset.dataset = datasrv.Read(id, main);

            var response = await MLconnection.getStatistic(dataset);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                return await response.Content.ReadAsStringAsync();
            }
            return BadRequest();
        }

    }
}
