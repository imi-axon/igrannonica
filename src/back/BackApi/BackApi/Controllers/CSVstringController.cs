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
        [HttpGet]
        public async Task<ActionResult<string>> Get(string csvstring)
        {
            tekst = csvstring;
            return tekst;
        }
        [HttpPost]
        public async Task<ActionResult<string>> Post( [FromBody] CSVstring content)
        {
            string csvstring;
            csvstring = content.csvstring;
            tekst = CsvValidacija.Validate(csvstring);
            Task.Run((Func<Task>)(() => KonekcijaSaML.posaljihttp(tekst)));
            //KonekcijaSaML.posaljihttp(tekst);
            return tekst;
        }
    }
}
