using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace BackApi.Controllers
{
    [Route("api/dataset")]
    [ApiController]
    public class CSVstringController : ControllerBase
    {
        private string tekst;
        [HttpGet("{project_id}/json")]
        public async Task<ActionResult<dynamic>> Get(int project_id)
        {
            //Debug.WriteLine(project_id);
            //VADI SE IZ BAZE CSV STRING KOJI ODGOVARA DATOM ID-U
            //UKOLIKO NEMA PROJKETA SA DATIM ID-EM VRACA VRACA NOT FOUND
            //UKOLIKO KORISNIK NIJE ULOGOVAN VRACA UNAUTHORIZED

            tekst = "n1;n2;n3;out\r1; 1; 0; 1\r1; 0; 0; 1\r0; 0; 1; 1\r1; 0; 1; 1\r0; 0; 0; 0\r";
            return Task.Run((Func<Task>)(() => KonekcijaSaML.posaljihttp(tekst)));
        }
        [HttpPost("post")]
        public async Task<ActionResult<string>> Post( [FromBody] CSVstring content)
        {
            string csvstring;
            csvstring = content.csvstring;
            Debug.WriteLine(csvstring);
            tekst = CsvValidacija.Validate(csvstring);  //NE KORISTIMO VISE
            //Task.Run((Func<Task>)(() => KonekcijaSaML.posaljihttp(tekst)));
            //KonekcijaSaML.posaljihttp(tekst);
            //TREBA DA 
            return tekst;
        }
    }
}
