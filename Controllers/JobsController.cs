using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CaseSite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CaseSite.Controllers
{
    [Produces("application/json")]
    [Route("api/Jobs")]
    public class JobsController : Controller
    {
        private readonly CaseSiteContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public JobsController(CaseSiteContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Jobs
        [HttpGet]
        public IActionResult GetJob()
        {
            var jobs = new List<dynamic>();

            foreach (var job in _context.Job.Include(j => j.Business))
            {
                jobs.Add(toClientJob(job));
            }

            return Ok(jobs);
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
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> PutJob([FromBody] Job job)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var serverJob = await _context.Job.SingleOrDefaultAsync(j => j.Id == job.Id);

            if(serverJob == null)
            {
                return NotFound();
            }

            serverJob.Deadline = job.Deadline;
            serverJob.Description = job.Description;
            serverJob.JobType = job.JobType;
            serverJob.MaxNumPersons = job.MaxNumPersons;
            serverJob.MinNumPersons = job.MinNumPersons;
            serverJob.RewardValue = job.RewardValue;
            serverJob.Title = job.Title;
            serverJob.WorkPlace = job.WorkPlace;

            _context.Entry(serverJob).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();

            return Ok(toClientJob(serverJob));
        }

        // POST: api/Jobs
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostJob([FromBody] Job j)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var business = await getBusiness();

            if (business == null)
                return NotFound();

            j.Business = business;
            var job = _context.Job.Add(j).Entity;
            business.Jobs.Add(job);
            _context.Entry(business).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Created("", toClientJob(job));
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

        
        [HttpGet("business")]
        [Authorize]
        public async Task<IActionResult> GetJobsFromBusiness()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var business = await getBusiness();

            if (business == null)
                return NotFound();

            var jobs = new List<dynamic>();

            foreach (var job in business.Jobs)
            {
                jobs.Add(toClientJob(job));
            }

            return Ok(jobs);
        }

        private async Task<Business> getBusiness()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            return await _context.Business.Include(b => b.Jobs).FirstOrDefaultAsync(b => b.UserId == user.Id);

            
        }

        private dynamic toClientJob(Job j)
        {
            return new
            {
                id = j.Id,
                title = j.Title,
                deadline = j.Deadline,
                description = j.Description,
                maxNumOfPersons = j.MaxNumPersons,
                minNumOfPersons = j.MinNumPersons,
                rewardValue = j.RewardValue,
                workPlace = j.WorkPlace,
                jobType = j.JobType,
                businessId = j.BusinessId,
                businessName = j.Business == null ? null : j.Business.Name
            };
        }
    }
}