using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NoviRaspored.Models;

namespace NoviRaspored.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZadataksController : ControllerBase
    {
        private readonly ZadatakContext _context;

        public ZadataksController(ZadatakContext context)
        {
            _context = context;
        }

        // GET: api/Zadataks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zadatak>>> GetRasporeds()
        {
            return await _context.Rasporeds.ToListAsync();
        }

        // GET: api/Zadataks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Zadatak>> GetZadatak(int id)
        {
            var zadatak = await _context.Rasporeds.FindAsync(id);

            if (zadatak == null)
            {
                return NotFound();
            }

            return zadatak;
        }

        // PUT: api/Zadataks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutZadatak(int id, Zadatak zadatak)
        {
            if (id != zadatak.zadId)
            {
                return BadRequest();
            }

            _context.Entry(zadatak).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ZadatakExists(id))
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

        // POST: api/Zadataks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Zadatak>> PostZadatak(Zadatak zadatak)
        {
            _context.Rasporeds.Add(zadatak);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetZadatak", new { id = zadatak.zadId }, zadatak);
        }

        // DELETE: api/Zadataks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteZadatak(int id)
        {
            var zadatak = await _context.Rasporeds.FindAsync(id);
            if (zadatak == null)
            {
                return NotFound();
            }

            _context.Rasporeds.Remove(zadatak);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ZadatakExists(int id)
        {
            return _context.Rasporeds.Any(e => e.zadId == id);
        }
    }
}
