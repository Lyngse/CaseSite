using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CaseSite.Models;
using Microsoft.AspNetCore.Authorization;

namespace CaseSite.Controllers
{
    [Produces("application/json")]
    [Route("api/Jobs")]
    public class JobsController : Controller
    {
        private readonly CaseSiteContext _context;

        public JobsController(CaseSiteContext context)
        {
            _context = context;
        }

        // GET: api/Jobs
        [HttpGet]
        public IEnumerable<Job> GetJob()
        {
            return _context.Job;
        }

        // GET: api/Jobs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var job = await _context.Job.SingleOrDefaultAsync(m => m.Id == id);

            if (job == null)
            {
                return NotFound();
            }

            return Ok(job);
        }

        // PUT: api/Jobs/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutJob([FromRoute] int id, [FromBody] Job job)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != job.Id)
            {
                return BadRequest();
            }

            _context.Entry(job).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobExists(id))
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

        // POST: api/Jobs
        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> PostJob([FromBody] Job job)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Job.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetJob", new { id = job.Id }, job);
        }

        // DELETE: api/Jobs/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteJob([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var job = await _context.Job.SingleOrDefaultAsync(m => m.Id == id);
            if (job == null)
            {
                return NotFound();
            }

            _context.Job.Remove(job);
            await _context.SaveChangesAsync();

            return Ok(job);
        }

        private bool JobExists(int id)
        {
            return _context.Job.Any(e => e.Id == id);
        }

        
        [HttpGet("business/{businessId}")]
        public async Task<IActionResult> GetJobsFromBusiness([FromRoute] int businessId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var business = await _context.Business.FirstOrDefaultAsync(b => b.Id == businessId);

            if (business == null)
            {
                return NotFound();
            }

            return Ok(business.Jobs);
        }
    }
}