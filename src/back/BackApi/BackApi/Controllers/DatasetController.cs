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
    [RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
    [RequestSizeLimit(209715200)]
    public class DatasetController : ControllerBase
    {
        private IDatasetService datasrv;
        private IJwtService jwtsrv;
        private IProjectService projsrv;
        private IStorageService storsrv;
        public DatasetController(IDatasetService datasetServis, IJwtService jwtServis, IProjectService projectService, IStorageService storageService)
        {
            this.datasrv = datasetServis;
            this.jwtsrv = jwtServis;
            this.projsrv=projectService;
            this.storsrv=storageService;
        }

        [HttpPost("{id}/dataset")]
        [RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
        [RequestSizeLimit(209715200)]
        public async Task<ActionResult<string>> NewDataSet(int id,IFormFile dataset )
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var chk = projsrv.projectOwnership(userid, id);
            if (!chk)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });
            var time = await datasrv.New(dataset, id, userid);
            if(!time)
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Greska pri pisanju fajla." });
            DatasetGetPost novi = new DatasetGetPost();
            novi.dataset= datasrv.ProjIdToPath(id,true);
            var response = await MLconnection.validateCSVstring(novi); // ceka se implementacija obrade fajla na ml-u a ne stringa

            if (response.StatusCode == HttpStatusCode.Created)
            {
                return StatusCode(StatusCodes.Status200OK, new { message = "Sve je u redu." });
            }
            else
            {
                datasrv.Delete(id);
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ne valja CSV." });
            }
            return Ok();
        }

        [HttpDelete("{projid}")]
        public async Task<ActionResult<string>> DeleteDataset(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var chk = projsrv.projectOwnership(userid, projid);
            if (!chk)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });
            var rez = datasrv.Delete(projid);
            if (rez)
                return Ok("Uspesno Obrisan");
            else return BadRequest("Vec obrisan ");
        }

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
            dataset.dataset = datasrv.ProjIdToPath(projid,main);
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
            dataset.dataset= datasrv.ProjIdToPath(id,main);
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
            dataset.dataset = datasrv.ProjIdToPath(id,main);
            if (dataset.dataset == null)
                return NotFound();
            DatasetMLPost snd = new DatasetMLPost();
            snd.dataset = dataset.dataset;
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

        [HttpGet("{projid}/dataset/{main}/page/{p}/rows/{r}")] //p-broj strane, r-broj redova po strani
        public async Task<ActionResult<dynamic>> Paging(int projid, Boolean main,int p, int r)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            Boolean owner;
            owner = projsrv.projectOwnership(userid, projid);
            if (!owner)
                return Forbid();
            var dataset = new DatasetPages();
            dataset =await datasrv.CreatePage(projid, main, p, r);
            if (dataset.dataset == null)
                return NotFound("Ne postoji dataset");
            dataset.dataset = dataset.dataset.Replace('\\', '/');
            var toml = new DatasetGetPost();
            toml.dataset = dataset.dataset;
            var response = await MLconnection.convertCSVstring(toml);
            var ret= await response.Content.ReadAsStringAsync();

            dataset.dataset = ret;
            storsrv.DeletePath(dataset.dataset);
            return Ok(dataset);
        }
    }
}
