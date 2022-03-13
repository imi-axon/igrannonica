using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogRegController : ControllerBase
    {
        private IKorisnikServis korsrv;

        public LogRegController(IKorisnikServis korisnikServis)
        {
            this.korsrv = korisnikServis;
        }

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(KorisnikApi req)
        {
            Boolean tmp = korsrv.Register(req);
            string rez = "";
            if (tmp)
            {rez = "Korisnik uspesno registrovan"; }
            else
            {rez = "Korisnik sa tim Username-om vec postoji!"; }

            return Ok(rez);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(KorisnikApi req)
        {
            Boolean uspeh;
            var rez = korsrv.Login(req, out uspeh);
            if (uspeh)
                return Ok(rez);
            else
                return BadRequest(rez);
        }
    }
}
