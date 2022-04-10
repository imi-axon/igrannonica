using BackApi.Services;
using BackApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using System.Net;
using System.Text;

namespace BackApi.Controllers
{
    [Route("api/projects/")]
    [ApiController]
    [Authorize]
    public class NNController : ControllerBase
    {
        private INNservice nnsrv;
        private IJwtService jwtsrv;
        private IProjectService projsrv;
        private IDatasetService datasrv;

        public NNController(INNservice nnService, IJwtService jwtServis, IProjectService projectService,IDatasetService datasetService)
        {
            this.nnsrv = nnService;
            this.jwtsrv = jwtServis;
            this.projsrv = projectService;
            this.datasrv = datasetService;
        }

        [HttpGet("{id}/nn/{nnid}/train/start")/*,AllowAnonymous*/]
        public async Task<ActionResult> Get(int id,int nnid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var chk = projsrv.projectOwnership(userid, id);
            if (!chk)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });

            var packet = new ApiNNTrain();
            var req = new ApiNNCfg();
            packet.conf = req.conf;
            packet.dataset = datasrv.ProjIdToPath(id, true);
            if (packet.dataset == null) return BadRequest("Ne postoji dataset");
            packet.dataset = packet.dataset.Replace('\\', '/');
            packet.nn = nnsrv.NNIdToPath(nnid);
            if (packet.nn == null) return BadRequest("Ne postoji Mreza");
            packet.nn = packet.nn.Replace('\\', '/');

            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                var webSocketfront = await HttpContext.WebSockets.AcceptWebSocketAsync();
                await nnsrv.MlTraining(webSocketfront,packet);
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
            return Ok();
        }

        [HttpPost("{id}/nn")]
        public async Task<ActionResult> CreateNN(int id,[FromBody] ApiNNTempCreate req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var chk = projsrv.projectOwnership(userid, id);
            if (!chk)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });
            var rez = await nnsrv.NNCreateTemp(id, req.Name);
            int nnid = nnsrv.GetNNid(id, req.Name);
            if (nnid == -1)
                return BadRequest();
            if (rez.StatusCode == HttpStatusCode.OK) return Ok(new {id=nnid});
            return BadRequest();        
        }
    }
}
