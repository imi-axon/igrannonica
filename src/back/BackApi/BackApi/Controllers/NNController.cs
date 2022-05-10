using BackApi.Services;
using BackApi.Models;
using BackApi.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using System.Net;
using System.Text;
using System.Diagnostics;
using Newtonsoft.Json;

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
        private IStorageService storsrv;
        private IWSQueue wsq;
        public NNController(INNservice nnService, IJwtService jwtServis, IProjectService projectService,IDatasetService datasetService, IStorageService storageService,
            IWSQueue wsQueue)
        {
            this.nnsrv = nnService;
            this.jwtsrv = jwtServis;
            this.projsrv = projectService;
            this.datasrv = datasetService;
            this.storsrv = storageService;
            this.wsq = wsQueue;
        }

        [HttpGet("{id}/nn/{nnid}/train/start")]
        public async Task<ActionResult> Train(int id, int nnid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!projsrv.projectExists(id)) return NotFound();
            if (!projsrv.projectOwnership(userid, id)) return Forbid();

            var packet = new ApiNNTrain();
            packet.dataset = datasrv.ProjIdToPath(id, true);
            if (packet.dataset == null) return BadRequest("dataset");
            packet.dataset = packet.dataset.Replace('\\', '/');
            packet.nn = nnsrv.NNIdToPath(nnid);
            if (packet.nn == null) return BadRequest("network");
            packet.nn = packet.nn.Replace('\\', '/');
            packet.conf = nnsrv.NNIdToCfg(nnid);
            if (packet.conf == null) return BadRequest("network");
            packet.conf = packet.nn.Replace('\\', '/');
            packet.trainrez = nnsrv.NNIdToTrainrez(nnid);
            if (packet.trainrez == null) return BadRequest("network");
            packet.trainrez = packet.nn.Replace('\\', '/');

            if (!wsq.CheckInDict(nnid)) 
            {
                if (HttpContext.WebSockets.IsWebSocketRequest)
                {
                    var webSocketfront = await HttpContext.WebSockets.AcceptWebSocketAsync();
                    wsq.AddToDict(nnid, webSocketfront);
                    var webSocketMl = new ClientWebSocket();
                    await webSocketMl.ConnectAsync(new Uri(Urls.mlWs + "/api/user"+userid+"/nn"+nnid+"/train"), CancellationToken.None);
                    try
                    {
                        var finished=await nnsrv.MlTraining(webSocketfront, packet,webSocketMl);
                        if(finished)
                            wsq.DeleteFromDict(nnid);// pitanje je da li ce ga zatvoriti nakon prve poruke ili nakon sto se ws
                    }
                    catch (Exception ex)
                    {
                        wsq.DeleteFromDict(nnid);
                        await webSocketMl.CloseAsync(WebSocketCloseStatus.NormalClosure,"Client Disconnect", CancellationToken.None);
                    }                
                }
                else
                {
                    HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                }
            }
            else
            {
                return BadRequest("error");
            }
            return Ok();
        }

        [HttpPost("{id}/nn")]
        public async Task<ActionResult> CreateNN(int id,[FromBody] ApiNNTempCreate req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!projsrv.projectExists(id)) return NotFound();
            if (!projsrv.projectOwnership(userid, id)) return BadRequest("user");

            var datapath = datasrv.ProjIdToPath(id, true);
            if (datapath == null) return BadRequest("dataset");
            var rez = await nnsrv.NNCreateTemp(id, req.Name,datapath);
            int nnid = nnsrv.GetNNid(id, req.Name);
            if (nnid == -1)
                return BadRequest("nn");
            if (rez.StatusCode == HttpStatusCode.OK) 
                return Ok(new {id=nnid});
            return BadRequest();        
        }

        [HttpGet("{id}/nn")]
        public async Task<ActionResult<string>> ListNN(int id)
        {
            bool ind = false;
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!projsrv.projectExists(id)) return NotFound();
            if (!projsrv.projectIsPublic(id))
                if (!projsrv.projectOwnership(userid, id)) BadRequest("user");

            string rez = nnsrv.ListNN(userid, id);
            if (rez == "[]")
                return NotFound("network");
            return Ok(rez);
        }

        [HttpGet("{id}/nn/{nnid}")]
        public async Task<ActionResult> GetNN(int id,int nnid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!projsrv.projectExists(id)) return NotFound();
            if (!projsrv.projectIsPublic(id))
                if (!projsrv.projectOwnership(userid, id)) return BadRequest("user");

            var sent = new ApiNNPost();
            sent.nn = storsrv.CreateNNFile (id, nnid);
            var resp = await MLconnection.GetNNJson(sent);
            if(resp.StatusCode == HttpStatusCode.OK)
            {
                var packet = new ApiNNGet();
                packet.nn = await resp.Content.ReadAsStringAsync();
                var tmp = storsrv.CreateNNCfg(id, nnid);
                packet.conf = storsrv.ReadCfg(tmp);

                var result= JsonConvert.SerializeObject(packet);
                return Ok(result);

            }
            return BadRequest("error");

        }
        [HttpPut("{id}/nn/{nnid}/notes")]
        public async Task<ActionResult<string>> AddNNNotes(int id, int nnid, [FromBody]ApiNNPutNote note)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!projsrv.projectExists(id)) return NotFound();
            if (!projsrv.projectOwnership(userid, id)) return Forbid();

            var chk = nnsrv.AddNote(id, nnid, note.note);
            if (!chk)
                return BadRequest();
            return Ok("uspesno");
        }
        [HttpGet("{id}/nn/{nnid}/notes")]
        public async Task<ActionResult<string>> GetNNNotes(int id, int nnid)
        {
            bool ind = false;
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!projsrv.projectExists(id)) return NotFound();
            if (!projsrv.projectIsPublic(id))
                if (!projsrv.projectOwnership(userid, id)) return Forbid();

            var res = nnsrv.GetNote(id, nnid, out ind);
            if (!ind)
                return BadRequest();
            return Ok(res);
        }
        [HttpDelete("{id}/nn/{nnid}")]
        public async Task<ActionResult> DeleteNN(int id,int nnid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!projsrv.projectExists(id)) return NotFound();
            if (!projsrv.projectOwnership(userid,id)) return BadRequest("user");

            Boolean rez = nnsrv.DeleteNN(nnid);
            if (rez)
                return Ok();
            else return BadRequest("error");
        }

        [HttpGet("/wstest/{nnid}"),AllowAnonymous]
        public async Task<ActionResult> WsTesting(int nnid)
        {
            return Ok();
        }
    }
}
