using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetController : ControllerBase
    {
        private IDatasetServis datasrv;
        public DatasetController(IDatasetServis datasetServis)
        {
            datasrv = datasetServis;
        }

        [HttpPost("{projid}/NoviDataset")]
        public async Task<ActionResult<string>> NoviDataset([FromBody] DatasetApi req,int projid)
        {

            var xd = datasrv.Novi(req,projid);

            return Ok(xd);
        }

        [HttpDelete("{projid}")]
        public async Task<ActionResult<string>> BrisiDataset(int projid)
        {
            var rez = datasrv.Brisi(projid);
            if (rez)
                return Ok("Uspesno Obrisan");
            else return BadRequest("Vec obrisan ili ne postoji");
        }

        [HttpGet("{projid}")]
        public async Task<ActionResult<string>> ListajDataset(int projid)
        {
            var rez = datasrv.Listaj(projid);
            if (rez != "[]")
                return Ok(rez);
            else return NotFound("Ne postoji dataset");
        }

        [HttpGet("{projid}/procitaj")]
        public async Task<ActionResult<string>> ProcitajDataset(int projid,Boolean main)
        {
            var rez = datasrv.Procitaj(projid,main);
            if (rez != null)
                return Ok(rez);
            else return NotFound("Ne postoji dataset");
        }

    }
}
