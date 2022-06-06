using BackApi.Entities;
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
            var id = service.CreateProject(userid);
           
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
        [AllowAnonymous]
        public async Task<ActionResult<string>> GetUserByProjectId(int projid)
        {
            bool ind = false;
            int userid = jwtsrv.GetUserId();
            var rez = service.GetUserByProj(projid, out ind);
            if (ind == false)
                return NotFound(rez);
            if (!service.projectIsPublic(projid))
            {
                if (userid == -1) return "Uloguj se";//Unauthorized("Ulogujte se");
                if (!service.projectOwnership(userid, projid)) return BadRequest("user");
            }
            return Ok(rez);
        }
        [HttpGet("{projid}")]
        [AllowAnonymous]
        public async Task<ActionResult<string>> GetProjectById(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (!service.projectExists(projid)) return NotFound("project");
            if (!service.projectIsPublic(projid))
            {
                if (userid == -1) return Unauthorized();
                if (!service.projectOwnership(userid, projid)) return BadRequest("user");
            }

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
            if (req.name == "" || req.name == null) return BadRequest("name");

            Boolean rez = service.EditProject(projid,req,userid);
            if (rez)
                return Ok();
            else return BadRequest("name");
        }

        [HttpPost("{projid}/comment/{parentcommentid}")]
        public async Task<ActionResult<string>> AddCommment(int projid, int parentcommentid, CommentPost comm)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!service.projectExists(projid)) return NotFound("project");

            Boolean rez = service.AddComment(projid, userid, parentcommentid, comm);
            if (rez)
                return Ok();
            else return NotFound("user");
        }

        [HttpGet("{projid}/comments")]
        public async Task<ActionResult<string>> GetCommments(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!service.projectExists(projid)) return NotFound("project");

            string rez = service.GetComment(projid);
            if (rez != "[]")
                return Ok(rez);
            else return NotFound("comment");
        }

        [HttpPut("{projid}/comment/{commentid}")]
        public async Task<ActionResult<string>> EditCommment(int projid, int commentid, CommentPost comm)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!service.projectExists(projid)) return NotFound("project");
            if (!service.commentExist(commentid)) return NotFound("comment");
            if (!service.commentOwnership(commentid, userid)) return BadRequest("user");
            var rez = service.editComment(commentid, comm.comment);
            if (rez)
                return Ok();
            else return NotFound("comment");
        }
        [HttpDelete("{projid}/comment/{commentid}")]
        public async Task<ActionResult<string>> DeleteCommment(int projid, int commentid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!service.projectExists(projid)) return NotFound("project");
            if (!service.commentExist(commentid)) return NotFound("comment");
            if (!service.commentOwnership(commentid, userid)) return BadRequest("user");
            var rez = service.deleteComment(commentid);
            if (rez)
                return Ok();
            else return NotFound("comment");
        }
        [HttpGet("{projid}/replies/{commentid}")]
        public async Task<ActionResult<string>> GetReplies(int projid, int commentid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!service.projectExists(projid)) return NotFound("project");
            if (!service.commentExist(commentid)) return NotFound("comment");
            if (!service.commentOwnership(commentid, userid)) return BadRequest("user");
            string rez = service.getReplies(projid, commentid);
            if (rez != "[]")
                return Ok(rez);
            else return NotFound("comment");
        }
    }
}
