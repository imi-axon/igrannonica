using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetController : ControllerBase
    {
        private IDatasetServis datasrv;
        public DatasetController(IDatasetServis datasetServis)
        {
            datasrv = datasetServis;
        }

        [HttpPost("{projid}/NoviDataset")]
        public async Task<ActionResult<string>> NoviDataset(DatasetApi req,int projid)
        {

            var xd = datasrv.Novi(req,projid);

            return Ok(xd);
        }
    }
}
