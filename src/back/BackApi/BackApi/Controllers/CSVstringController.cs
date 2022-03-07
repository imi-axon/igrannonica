using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CSVstringController : ControllerBase
    {
        private static List<CSVstring> tekstovi = new List<CSVstring>()
        {
            new CSVstring { csvtekst = "hello1" },
            new CSVstring { csvtekst = "hello2" },
            new CSVstring { csvtekst = "hello3" }
        };
        [HttpGet]
        public async Task<ActionResult<List<CSVstring>>> Get()
        {
            return Ok(tekstovi);
        }

        [HttpPost]
        public async Task<ActionResult<List<CSVstring>>> Post(CSVstring csvstring)
        {
            tekstovi.Add(csvstring);
            return Ok(tekstovi);
        }
    }
}
