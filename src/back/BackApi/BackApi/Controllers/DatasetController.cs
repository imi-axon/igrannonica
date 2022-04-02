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
        private IProjectService projsrv;
        public DatasetController(IDatasetService datasetServis, IJwtService jwtServis, IProjectService projectService)
        {
            this.datasrv = datasetServis;
            this.jwtsrv = jwtServis;
            this.projsrv=projectService;
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
        public async Task<ActionResult<string>> NewDataSet(int id,IFormFile req )
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var chk = projsrv.projectOwnership(userid, id);
            if (!chk)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });
            datasrv.New(req, id, userid);          
            DatasetGetPost novi = new DatasetGetPost();
            novi.dataset= datasrv.ProjIdToPath(id);
            var response = await MLconnection.validateCSVstring(novi); // ceka se implementacija obrade fajla na ml-u a ne stringa

            if (response.StatusCode == HttpStatusCode.Created)
            {
                return StatusCode(StatusCodes.Status200OK, new { message = "Sve je u redu." });
            }
            else
            {
                datasrv.Delete(id, userid);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ne valja CSV." });
            }
            
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

        [HttpGet("{projid}/dataset/{main}")]
        public async Task<ActionResult<dynamic>> ReadDataset(int projid,Boolean main)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            Boolean owner;
            owner = projsrv.projectOwnership(userid, projid);
            if (!owner)
                return Forbid();
            DatasetGetPost dataset = new DatasetGetPost();
            dataset.dataset = datasrv.ProjIdToPath(projid);
            if(dataset.dataset==null)
                return NotFound("Ne postoji dataset");
            var response = await MLconnection.convertCSVstring(dataset);

           return await response.Content.ReadAsStringAsync();
        }

        [HttpGet("{id}/dataset/{main}/statistics")]
        public async Task<ActionResult<string>> GetStatistics(int id, Boolean main)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            
            DatasetGetPost dataset = new DatasetGetPost();
            Boolean owner;
            owner = projsrv.projectOwnership(userid,id);
            if (!owner)
                return Forbid();
            dataset.dataset= datasrv.ProjIdToPath(id);
            if (dataset.dataset == null)
                return NotFound();

            var response = await MLconnection.getStatistic(dataset);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                return await response.Content.ReadAsStringAsync();
            }
            return BadRequest();
        }

        [HttpPut("{id}/dataset/{main}/edit")]
        public async Task<ActionResult<string>> EditDataset(int id, Boolean main, [FromBody] ActionsPut act)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            Boolean owner;
            owner = projsrv.projectOwnership(userid, id);
            if (!owner)
                return Forbid();
            var dataset = new DatasetGetPost();
            dataset.dataset = datasrv.ProjIdToPath(id);
            if (dataset.dataset == null)
                return NotFound();
            DatasetMLPost snd = new DatasetMLPost();
            snd.data = dataset.dataset;
            snd.actions = act.actions;
            var response = await MLconnection.editDataset(snd);
            if(response.StatusCode == HttpStatusCode.OK)
            {
                var savestr = new DatasetGetPost();
                savestr.dataset = await response.Content.ReadAsStringAsync();
                if (datasrv.EditHelperset(id, userid, savestr))
                {
                    return Ok();
                }
                else return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Greska prilikom cuvanja promena" });
            }
            return BadRequest();
        }
        [HttpPut("{id}/dataset/save")]
        public async Task<ActionResult<string>> SaveDataset(int id)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            Boolean owner;
            var chk = datasrv.UpdateMainDataset(id, userid, out owner);
            if (!owner)
                return Forbid();
            if(!chk)
                return NotFound();
            return Ok();
        }
    }
}
