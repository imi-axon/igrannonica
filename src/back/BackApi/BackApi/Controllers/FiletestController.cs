using BackApi.Services;
using BackApi.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using BackApi.Models;

namespace BackApi.Controllers
{
    [Route("api/files")]
    [ApiController]
    [RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
    [RequestSizeLimit(209715200)]
    public class FiletestController : ControllerBase
    {
        private IStorageService storsrv;
        private IDatasetService datasrv;
        private IJwtService jwtsrv;
        private IProjectService projsrv;
        private IConfiguration configuration;

        private const string mlUrl = "localhost:8000";
        private const string backUrl = "localhost:7057";
        //private const string mlUrl = "147.91.204.115:10017";
        //private const string backUrl = "147.91.204.115:10016";


        public FiletestController(IStorageService storageService,IDatasetService datasetService, 
                                  IJwtService jwtService, IProjectService projectService, IConfiguration configuration)
        {
            this.storsrv = storageService;
            this.datasrv = datasetService;
            this.jwtsrv = jwtService;
            this.projsrv = projectService;
            this.configuration = configuration;
            
        }

        [Authorize]
        [HttpGet("{projid}")]
        public async Task<ActionResult> DownloadDataset(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!projsrv.projectExists(projid)) return NotFound();
            if(!projsrv.projectIsPublic(projid))
                if (!projsrv.projectOwnership(userid, projid)) return BadRequest("user");

            var path = storsrv.GetDataset(datasrv.ProjIdToPath(projid, false));
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/csv",Path.GetFileName(path));
        }

        [HttpGet("Storage/proj{projid}/mreze/trainrez{nnid}.txt")]
        [AllowAnonymous]
        public async Task<ActionResult> DownloadTrainrez(int projid,int nnid)
        {
            int userid = jwtsrv.GetUserId();
            if (!projsrv.projectExists(projid)) return NotFound();
            if (!projsrv.projectIsPublic(projid))
            {
                if (userid == -1) return Unauthorized();
                if (!projsrv.projectOwnership(userid, projid)) return Forbid();
            }

            var path = storsrv.CreateNNtrainrez(projid,nnid);
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/plain", Path.GetFileName(path));
        }

        [HttpGet("Storage/proj{pid}/data/data{did}.csv"), AllowAnonymous] //Host(backUrl, mlUrl)] //adresa ml mikroserivsa
        public async Task<ActionResult> PassDatasetToML(int pid,int did)
        {
            //Debug.WriteLine();
            var path = storsrv.CreateDataset(pid,did);
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/csv", Path.GetFileName(path));
        }

        [HttpGet("Storage/proj{pid}/data/Initial.csv"), AllowAnonymous] //Host(backUrl, mlUrl)] //adresa ml mikroserivsa
        public async Task<ActionResult> PassInitialDatasetToML(int pid)
        {
            //Debug.WriteLine();
            var path = storsrv.InitialFilePath(pid);
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/csv", Path.GetFileName(path));
        }

        [HttpGet("Storage/proj{pid}/data/meta{txt}.txt"), AllowAnonymous]
        public async Task<ActionResult> PassMetaToML(int pid, string txt)
        {
            Boolean main;
            if (txt == "main") main = true;
            else main = false;
            var path = storsrv.MetaFilePath(pid, main);
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            Debug.WriteLine("--==| GET METADATA : " + txt);
            return File(bytes, "text/plain", Path.GetFileName(path));
        }

        [HttpPut("Storage/proj{pid}/data/meta{txt}.txt"), AllowAnonymous]
        public async Task<ActionResult> PutMeta(int pid, string txt, IFormFile file)
        {
            Boolean main;
            if (txt == "main") main = true;
            else main = false;
            var path = storsrv.MetaFilePath(pid, main);

            Debug.WriteLine("--==| SET METADATA : " + txt + " : size " + file.Length);
            storsrv.SaveFile(path, file);
            return Ok();
        }

        [HttpPut("Storage/proj{pid}/mreze/mreza{nnid}.h5")]
        public async Task<ActionResult> PutNNFile(int pid, int nnid, IFormFile file ) 
        {
            var path = storsrv.CreateNNFile(pid, nnid);
            storsrv.SaveFile(path, file);
            return Ok();
        }

        [HttpPut("Storage/proj{pid}/mreze/cfg{nnid}.json")]
        public async Task<ActionResult> PutNNCfg(int pid, int nnid, IFormFile file)
        {
            var path = storsrv.CreateNNCfg(pid, nnid);
            storsrv.SaveFile(path, file);
            return Ok();
        }
        [HttpPut("Storage/proj{pid}/mreze/trainrez{nnid}.txt")]
        public async Task<ActionResult> PutNNTrainrez(int pid, int nnid, IFormFile file)
        {
            var path = storsrv.CreateNNtrainrez(pid, nnid);
            storsrv.SaveFile(path, file);
            return Ok();
        }
        [HttpGet("Storage/proj{pid}/mreze/mreza{nnid}.h5"), AllowAnonymous] //Host(backUrl, mlUrl)] //adresa ml mikroserivsa
        public async Task<ActionResult> PassNNToML(int pid, int nnid)
        {
            var path = storsrv.CreateNNFile(pid, nnid);
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/plain", Path.GetFileName(path));
        }
        [HttpGet("Storage/proj{pid}/mreze/cfg{nnid}.json"), AllowAnonymous] //Host(backUrl, mlUrl)] //adresa ml mikroserivsa
        public async Task<ActionResult> PassCfgToML(int pid, int nnid)
        {
            var path = storsrv.CreateNNCfg(pid, nnid);
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/plain", Path.GetFileName(path));
        }
        [HttpGet("Storage/{pagepath}")]
        public async Task<ActionResult> PassPageToML(string pagepath)
        {
            pagepath = @"Storage/" + pagepath;
            var bytes=await System.IO.File.ReadAllBytesAsync(pagepath);
            return File(bytes, "text/csv", Path.GetFileName(pagepath));
        }

        [HttpPost("xd")]//file response - save from stream testing - live testing controller
        public async Task<ActionResult> FileRespTest([FromBody] string token)
        {
            var uid = jwtsrv.GetUserIdWs(token);
            
            /*HttpClient client = new HttpClient();
            var resp = await client.GetAsync("http://localhost:10016/api/files/Storage/proj2/data/data17.csv");
            var str= await resp.Content.ReadAsStreamAsync();
            var path = @"Storage/xddd.csv";
            storsrv.SaveStream(path,str);*/
            return Ok(uid);
        }

    }
}
