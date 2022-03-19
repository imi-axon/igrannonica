using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<string>> NoviDataset()
        {
            return Ok("xd");
        }
    }
}
