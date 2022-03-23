﻿using BackApi.Models;
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
        private IDatasetServis datasrv;
        private IJwtServis jwtsrv;
        public DatasetController(IDatasetServis datasetServis, IJwtServis jwtServis)
        {
            this.datasrv = datasetServis;
            this.jwtsrv = jwtServis;
        }

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
            var response = await KonekcijaSaML.convertCSVstring(pom);

            return await response.Content.ReadAsStringAsync();
        }
        
        [HttpPost("{id}/dataset")]
        public async Task<ActionResult<string>> NewDataSet(int id, [FromBody] DatasetGetPost req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var response = await KonekcijaSaML.validateCSVstring(req);

            if (response.StatusCode == HttpStatusCode.Created)
            {
                var chk=datasrv.Novi(req, id,userid);
                if (chk)
                    return StatusCode(StatusCodes.Status200OK, new { message = "Sve je u redu." });
                else return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ne valja CSV." });
        }

        [HttpDelete("{projid}")]
        public async Task<ActionResult<string>> BrisiDataset(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var rez = datasrv.Brisi(projid,userid);
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

        [HttpGet("{projid}/procitaj")]
        public async Task<ActionResult<string>> ProcitajDataset(int projid,Boolean main)
        {
            var rez = datasrv.Procitaj(projid,main);
            if (rez != null)
            {
                var response = await KonekcijaSaML.convertCSVstring(rez);

                return await response.Content.ReadAsStringAsync();
            }
            else return NotFound("Ne postoji dataset");
        }

        [HttpGet("{id}/dataset/{main}/statistics")]
        public async Task<ActionResult<string>> DajStatistiku(int id, Boolean main)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            string csvstring = datasrv.Procitaj(id, main);

            var response = await KonekcijaSaML.getStatistic(csvstring);
            if (response.StatusCode == HttpStatusCode.Created)
            {
                return Ok(response);
            }
            return BadRequest();
        }

    }
}