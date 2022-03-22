using BackApi.Models;
using BackApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace BackApi.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IKorisnikServis korsrv;
        private IJwtServis jwtsrv;

        public UsersController(IKorisnikServis korisnikServis,IJwtServis jwtServis)
        {
            this.korsrv = korisnikServis;
            this.jwtsrv = jwtServis;
        }

        [HttpPost]
        public async Task<ActionResult<string>> Register(KorisnikRegister req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid != -1) return Forbid();
            Boolean tmp = korsrv.Register(req);
            string rez = "";
            if (tmp)
            {   
                rez = "Korisnik uspesno registrovan";
                return Ok(rez);
            }
            else
            {
                rez = "Korisnik sa tim Username-om vec postoji!";
                return BadRequest(rez);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(KorisnikLogin req)
        {
            int userid = jwtsrv.GetUserId();
            if (userid != -1) return Forbid();
            Boolean uspeh;
            var rez = korsrv.Login(req, out uspeh);
            if (uspeh)
                return Ok(new
                {
                     v = rez

                });   
            else
                return BadRequest(rez);
        }
    }
}
