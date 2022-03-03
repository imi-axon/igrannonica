using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjekatNovi.Modeli;

namespace ProjekatNovi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KorisnikDetaljiController : ControllerBase
    {
        private readonly KorisniciDC _context;

        public KorisnikDetaljiController(KorisniciDC context)
        {
            _context = context;
        }

        // GET: api/KorisnikDetalji
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KorisnikDetalji>>> GetKorisnikDetalji()
        {
            return await _context.KorisnikDetalji.ToListAsync();
        }

        // GET: api/KorisnikDetalji/5
        [HttpGet("{id}")]
        public async Task<ActionResult<KorisnikDetalji>> GetKorisnikDetalji(int id)
        {
            var korisnikDetalji = await _context.KorisnikDetalji.FindAsync(id);

            if (korisnikDetalji == null)
            {
                return NotFound();
            }

            return korisnikDetalji;
        }

        // PUT: api/KorisnikDetalji/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKorisnikDetalji(int id, KorisnikDetalji korisnikDetalji)
        {
            if (id != korisnikDetalji.IDkorisnika)
            {
                return BadRequest();
            }

            _context.Entry(korisnikDetalji).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KorisnikDetaljiExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/KorisnikDetalji
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<KorisnikDetalji>> PostKorisnikDetalji(KorisnikDetalji korisnikDetalji)
        {
            _context.KorisnikDetalji.Add(korisnikDetalji);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetKorisnikDetalji", new { id = korisnikDetalji.IDkorisnika }, korisnikDetalji);
        }

        // DELETE: api/KorisnikDetalji/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKorisnikDetalji(int id)
        {
            var korisnikDetalji = await _context.KorisnikDetalji.FindAsync(id);
            if (korisnikDetalji == null)
            {
                return NotFound();
            }

            _context.KorisnikDetalji.Remove(korisnikDetalji);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KorisnikDetaljiExists(int id)
        {
            return _context.KorisnikDetalji.Any(e => e.IDkorisnika == id);
        }
    }
}
