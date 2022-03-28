using BackApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FiletestController : ControllerBase
    {
        private IStorageService storsrv;
        private IDatasetService datasrv;
        public FiletestController(IStorageService storageService,IDatasetService datasetService)
        {
            this.storsrv = storageService;
            this.datasrv = datasetService;
        }


        [HttpGet("{projid}")]
        public async Task<ActionResult> DownloadDataset(int projid)
        {
            var path = storsrv.GetDataset(datasrv.ProjIdToPath(projid));
            var bytes = await System.IO.File.ReadAllBytesAsync(path);

            return File(bytes, "text/csv",Path.GetFileName(path));
        }

    }
}
