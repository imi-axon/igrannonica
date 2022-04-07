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
    public class WSTestController : ControllerBase
    {
        private IWSService wssrv;
        private IJwtService jwtsrv;
        private IProjectService projsrv;
        private IDatasetService datasrv;

        public WSTestController(IWSService wSService, IJwtService jwtServis, IProjectService projectService,IDatasetService datasetService)
        {
            this.wssrv = wSService;
            this.jwtsrv = jwtServis;
            this.projsrv = projectService;
            this.datasrv = datasetService;
        }

        [HttpGet("{id}/nn/{nnid}/train/start"),AllowAnonymous]
        public async Task Get(int id,int nnid)
        {
            /*int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var chk = projsrv.projectOwnership(userid, id);
            if (!chk)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });*/
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                var webSocketfront = await HttpContext.WebSockets.AcceptWebSocketAsync();
                var packet = new ApiNNTrain();
                var req = new ApiNNCfg();
                packet.conf = req.conf;
                packet.dataset= datasrv.ProjIdToPath(id,true);
                packet.dataset=packet.dataset.Replace('\\', '/');
                //packet.nn=wssrv.NNIdToPath(nnid);
                //packet.nn= packet.nn.Replace('\\', '/');
                packet.nn = "placeholder";

                await wssrv.MlTraining(webSocketfront,packet);
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }

        [HttpPost("{id}/nn")]
        public async Task<ActionResult> CreateNN(int id,[FromBody] ApiNNTempCreate req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var chk = projsrv.projectOwnership(userid, id);
            if (!chk)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });
            var rez = await wssrv.NNCreateTemp(id, req.Name);
            int nnid = wssrv.GetNNid(id, req.Name);
            if (nnid == -1)
                return BadRequest();
            if (rez.StatusCode == HttpStatusCode.OK) return Ok(new {id=nnid});
            return BadRequest();        
        }

    }
}
