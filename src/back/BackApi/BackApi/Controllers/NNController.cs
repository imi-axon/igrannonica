﻿using BackApi.Services;
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

        [HttpGet("{id}/nn/{nnid}/train/start"),AllowAnonymous]
        public async Task<ActionResult> Train(int id, int nnid)
        {/*
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var chk = projsrv.projectOwnership(userid, id);
            if (!chk)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });
            */
            var packet = new ApiNNTrain();
            packet.dataset = datasrv.ProjIdToPath(id, true);
            if (packet.dataset == null) return BadRequest("Ne postoji dataset");
            packet.dataset = packet.dataset.Replace('\\', '/');
            packet.nn = nnsrv.NNIdToPath(nnid);
            if (packet.nn == null) return BadRequest("Ne postoji Mreza");
            packet.nn = packet.nn.Replace('\\', '/');
            packet.conf = nnsrv.NNIdToCfg(nnid);
            if (packet.conf == null) return BadRequest("Ne postoji Config");
            packet.conf = packet.nn.Replace('\\', '/');

            if (!wsq.CheckInDict(nnid)) 
            {
                if (HttpContext.WebSockets.IsWebSocketRequest)
                {
                    var webSocketfront = await HttpContext.WebSockets.AcceptWebSocketAsync();
                    wsq.AddToDict(nnid, webSocketfront);
                    var webSocketMl = new ClientWebSocket();
                    await webSocketMl.ConnectAsync(new Uri(Urls.mlWs + "/api/nn/train/start"), CancellationToken.None);
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
                return BadRequest("Na toj Mrezi se vec vrsi treniranje");
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
            var datapath = datasrv.ProjIdToPath(id, true);
            if (datapath == null) return BadRequest();
            var rez = await nnsrv.NNCreateTemp(id, req.Name,datapath);
            int nnid = nnsrv.GetNNid(id, req.Name);
            if (nnid == -1)
                return BadRequest();
            if (rez.StatusCode == HttpStatusCode.OK) return Ok(new {id=nnid});
            return BadRequest();        
        }

        [HttpGet("{id}/nn")]
        public async Task<ActionResult<string>> ListNN(int id)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            string rez = nnsrv.ListNN(userid, id);
            return rez;
        }

        [HttpGet("{id}/nn/{nnid}")]
        public async Task<ActionResult> GetNN(int id,int nnid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var chk = projsrv.projectOwnership(userid, id);
            if (!chk)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });

            var sent = new ApiNNPost();
            sent.nn = storsrv.CreateNNFile (id, nnid);
            if (sent.nn == null)
                return BadRequest();
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
            return BadRequest();

        }
        [HttpDelete("{id}/nn/{nnid}")]
        public async Task<ActionResult> DeleteNN(int id,int nnid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized("Ulogujte se");
            var chk = projsrv.projectOwnership(userid, id);
            if (!chk)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Vi niste vlasnik projekta" });
            Boolean rez = nnsrv.DeleteNN(nnid);
            if (rez)
                return Ok("Mreza izbrisana");
            else return BadRequest("Greska pri brisanju");
        }

        [HttpGet("/wstest/{nnid}"),AllowAnonymous]
        public async Task<ActionResult> WsTesting(int nnid)
        {
            return Ok();
        }
    }
}
