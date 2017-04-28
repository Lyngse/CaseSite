using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CaseSite.Models;

namespace CaseSite.Controllers
{
    [Produces("application/json")]
    [Route("api/Businesses")]
    public class BusinessesController : Controller
    {
        private readonly CaseSiteContext _context;

        public BusinessesController(CaseSiteContext context)
        {
            _context = context;
        }

        // GET: api/Businesses
        [HttpGet]
        public IEnumerable<Business> GetBusiness()
        {
            return _context.Business;
        }

        // GET: api/Businesses/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBusiness([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var business = await _context.Business.SingleOrDefaultAsync(m => m.Id == id);

            if (business == null)
            {
                return NotFound();
            }

            return Ok(business);
        }

        // PUT: api/Businesses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBusiness([FromRoute] int id, [FromBody] Business business)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != business.Id)
            {
                return BadRequest();
            }

            _context.Entry(business).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusinessExists(id))
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

        // POST: api/Businesses
        [HttpPost]
        public async Task<IActionResult> PostBusiness([FromBody] Business business)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Business.Add(business);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBusiness", new { id = business.Id }, business);
        }

        // DELETE: api/Businesses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusiness([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var business = await _context.Business.SingleOrDefaultAsync(m => m.Id == id);
            if (business == null)
            {
                return NotFound();
            }

            _context.Business.Remove(business);
            await _context.SaveChangesAsync();

            return Ok(business);
        }

        private bool BusinessExists(int id)
        {
            return _context.Business.Any(e => e.Id == id);
        }
    }
}