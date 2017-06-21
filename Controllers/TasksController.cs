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
    [Route("api/Tasks")]
    public class TasksController : Controller
    {
        private readonly CaseSiteContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public TasksController(CaseSiteContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Tasks
        [HttpGet]
        public IActionResult GetJob()
        {
            var tasks = new List<dynamic>();

            foreach (var task in _context.Task.Include(j => j.Business))
            {
                tasks.Add(toClientJob(task));
            }

            return Ok(tasks);
        }

        // GET: api/Jobs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var task = await _context.Task.SingleOrDefaultAsync(m => m.Id == id);

            if (task == null)
            {
                return NotFound();
            }

            return Ok(task);
        }

        // PUT: api/Jobs/5
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> PutJob([FromBody] Models.Task task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var serverTask = await _context.Task.SingleOrDefaultAsync(j => j.Id == task.Id);

            if(serverTask == null)
            {
                return NotFound();
            }

            serverTask.Deadline = task.Deadline;
            serverTask.Description = task.Description;
            serverTask.Type = task.Type;
            serverTask.RewardValue = task.RewardValue;
            serverTask.Title = task.Title;
            serverTask.WorkPlace = task.WorkPlace;
            serverTask.Address = task.Address;
            serverTask.City = task.City;
            serverTask.ContactDescription = task.ContactDescription;
            serverTask.RewardType = task.RewardType;
            serverTask.Zip = task.Zip;
            serverTask.CreationTime = task.CreationTime;


            _context.Entry(serverTask).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();

            return Ok(toClientJob(serverTask));
        }

        // POST: api/Jobs
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostJob([FromBody] Models.Task t)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var business = await getBusiness();

            if (business == null)
                return NotFound();

            t.Business = business;
            var task = _context.Task.Add(t).Entity;
            business.Tasks.Add(task);
            _context.Entry(business).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Created("", toClientJob(task));
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

            var task = await _context.Task.SingleOrDefaultAsync(m => m.Id == id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Task.Remove(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        private bool JobExists(int id)
        {
            return _context.Task.Any(e => e.Id == id);
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

            var tasks = new List<dynamic>();

            foreach (var task in business.Tasks)
            {
                tasks.Add(toClientJob(task));
            }

            return Ok(tasks);
        }

        private async Task<Business> getBusiness()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            return await _context.Business.Include(b => b.Tasks).FirstOrDefaultAsync(b => b.UserId == user.Id);

            
        }

        private dynamic toClientJob(Models.Task t)
        {
            return new
            {
                id = t.Id,
                title = t.Title,
                deadline = t.Deadline,
                description = t.Description,
                rewardType = t.RewardType,
                rewardValue = t.RewardValue,
                workPlace = t.WorkPlace,
                type = t.Type,
                businessId = t.BusinessId,
                businessName = t.Business == null ? null : t.Business.Name,
                address = t.Address,
                zip = t.Zip,
                city = t.City,
                creationTime = t.CreationTime,
                contactDescription = t.ContactDescription
            };
        }
    }
}