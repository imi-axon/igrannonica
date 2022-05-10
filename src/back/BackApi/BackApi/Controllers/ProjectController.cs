﻿using BackApi.Entities;
using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackApi.Controllers
{
    [Route("api/projects")]
    [ApiController]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private IProjectService service;
        private IJwtService jwtsrv;
        private IUserService userService;
        public ProjectController(IProjectService service, IJwtService jwtServis, IUserService userService)
        {
            this.service = service;
            this.jwtsrv = jwtServis;
            this.userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult<string>> NewProject()
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            string rez;
            rez = service.CreateProject(userid);
            int id = service.getProjectId(rez);
            if (id!=-1)
                return id+"";
            else return BadRequest("project");
        }

        [HttpDelete("{projid}/delete")]
        public async Task<ActionResult<string>> DeleteProject(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!service.projectExists(projid)) return NotFound("project");
            if (!service.projectOwnership(userid, projid)) return BadRequest("user");

            Boolean rez = service.DeleteProject(projid,userid);
            if (rez)
                return Ok();
            else return BadRequest("project");
        }

        [HttpPut("{projid}/notes")]
        public async Task<ActionResult<string>> SetNotes(int projid, [FromBody]NotePut note)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!service.projectExists(projid)) return NotFound("project");
            if (!service.projectOwnership(userid, projid)) return BadRequest("user");

            var rez = service.SetNote(projid, userid, note.note);
            if (rez)
                return Ok("uspesno");
            else return NotFound();
        }
        [HttpGet("{projid}/notes")]
        public async Task<ActionResult<string>> GetNotes(int projid)
        {
            bool ind = false;
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!service.projectExists(projid)) return NotFound("project");
            if (!service.projectIsPublic(projid))
                if (!service.projectOwnership(userid, projid)) return BadRequest("user");

            var rez = service.GetNote(projid, userid, out ind);
            if (ind)
                return Ok(rez);
            else return NotFound();
        }
        [HttpGet("{projid}/getuser")]
        public async Task<ActionResult<string>> GetUserByProjectId(int projid)
        {
            bool ind = false;
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return "Uloguj se";//Unauthorized("Ulogujte se");
            var rez = service.GetUserByProj(projid, out ind);
            if (ind == false)
                return NotFound(rez);
            else return Ok(rez);
        }
        [HttpGet("{projid}")]
        public async Task<ActionResult<string>> GetProjectById(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!service.projectExists(projid)) return NotFound("project");
            if (!service.projectIsPublic(projid))
                if (!service.projectOwnership(userid, projid)) return BadRequest("user");

            var rez = service.GetProjById(projid, userid);
            if (rez != "")
                return Ok(rez);
            else return NotFound("project");
        }
        [HttpGet]
        public async Task<ActionResult<string>> ListProjects()
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();

            var rez = service.ListProjects(userid,userid);
            if (rez != "[]")
                return Ok(rez);
            else return NotFound("project");
        }

        [HttpPut("{projid}")]
        public async Task<ActionResult<string>> EditProject(int projid,ProjectEdit req)
        {
            bool tmp = false;
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!service.projectExists(projid)) return NotFound("project");
            if (!service.projectOwnership(userid, projid)) return BadRequest("user");

            Boolean rez = service.EditProject(projid,req,userid);
            if (rez)
                return Ok();
            else return NotFound("user");
        }
    }
}
