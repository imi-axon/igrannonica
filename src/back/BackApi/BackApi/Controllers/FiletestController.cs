using BackApi.Services;
using BackApi.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

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

        private const string mlUrl = "localhost:8000";
        private const string backUrl = "localhost:7057";
        //private const string mlUrl = "147.91.204.115:10017";
        //private const string backUrl = "147.91.204.115:10016";


        public FiletestController(IStorageService storageService,IDatasetService datasetService, IJwtService jwtService, IProjectService projectService)
        {
            this.storsrv = storageService;
            this.datasrv = datasetService;
            this.jwtsrv = jwtService;
            this.projsrv = projectService;
            
        }

        [Authorize]
        [HttpGet("{projid}")]
        public async Task<ActionResult> DownloadDataset(int projid)
        {
            int userid = jwtsrv.GetUserId();
            if (userid == -1) return Unauthorized();
            if (!projsrv.projectOwnership(userid, projid)) return Forbid();

            var path = storsrv.GetDataset(datasrv.ProjIdToPath(projid, false));
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/csv",Path.GetFileName(path));
        }

        [HttpGet("Storage/proj{pid}/data/data{did}.csv"),Host(backUrl, mlUrl)] //adresa ml mikroserivsa
        public async Task<ActionResult> PassDatasetToML(int pid,int did)
        {
            var path = storsrv.GetDataset(datasrv.ProjIdToPath(pid, true));
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/csv", Path.GetFileName(path));
        }


        [HttpPut("Storage/proj{pid}/mreze/mreza{nnid}.h5")]
        public async Task<ActionResult> PutNNFile(int pid, int nnid, IFormFile file ) 
        {
            Debug.WriteLine("PUT NN");
            var path = storsrv.CreateNNFile(pid, nnid);
            storsrv.SaveFile(path, file);
            return Ok();
        }

        [HttpPut("Storage/proj{pid}/mreze/cfg{nnid}.json")]
        public async Task<ActionResult> PutNNCfg(int pid, int nnid, IFormFile file)
        {
            Debug.WriteLine("PUT CFG");
            var path = storsrv.CreateNNCfg(pid, nnid);
            storsrv.SaveFile(path, file);
            return Ok();
        }
        [HttpGet("Storage/proj{pid}/mreze/mreza{nnid}.h5"), Host(backUrl, mlUrl)] //adresa ml mikroserivsa
        public async Task<ActionResult> PassNNToML(int pid, int nnid)
        {
            var path = storsrv.CreateNNFile(pid, nnid);
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/csv", Path.GetFileName(path));
        }
        [HttpGet("Storage/proj{pid}/mreze/cfg{nnid}.json"), Host(backUrl, mlUrl)] //adresa ml mikroserivsa
        public async Task<ActionResult> PassCfgToML(int pid, int nnid)
        {
            var path = storsrv.CreateNNCfg(pid, nnid);
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/csv", Path.GetFileName(path));
        }
    }
}
