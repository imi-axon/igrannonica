using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace BackApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CSVstringController : ControllerBase
    {
        private string tekst;
        private string tekst2;
        [HttpGet]
        public async Task<ActionResult<string>> Get(string csvstring)
        {
            tekst = csvstring;
            return tekst;
        }
        [HttpPost]
        public async Task<ActionResult<string>> Post(string csvstring)
        {
            tekst2 = csvstring;
            Debug.WriteLine(tekst2);
            tekst = CsvValidacija.Validate(csvstring);
            Debug.WriteLine(tekst);
            return tekst;
        }
    }
}
