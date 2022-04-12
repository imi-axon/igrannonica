using BackApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace BackApi.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FiletestController : ControllerBase
    {
        private IStorageService storsrv;
        private IDatasetService datasrv;
        private IJwtService jwtsrv;
        private IProjectService projsrv;
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

        [HttpGet("Storage/proj{pid}/data/data{did}.csv"),Host("localhost:7057","localhost:8000")] //adresa ml mikroserivsa
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
    }
}
