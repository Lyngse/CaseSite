using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CaseSite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;

namespace CaseSite.Controllers
{
    [Produces("application/json")]
    [Route("api/Tasks")]
    public class TasksController : Controller
    {
        private readonly UnifactoContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public TasksController(UnifactoContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Tasks
        [HttpGet]
        public IActionResult GetTask()
        {
            var tasks = new List<dynamic>();

            foreach (var task in _context.Task.Include(j => j.Business).Where(t => t.Deadline > DateTimeOffset.Now))
            {
                tasks.Add(toClientTask(task));
            }

            return Ok(tasks);
        }

        [HttpGet("getlatest")]
        public IActionResult GetLatestTasks()
        {
            var tasks = new List<dynamic>();

            foreach (var task in _context.Task.Include(j => j.Business).OrderByDescending(t => t.CreationTime).Where(t => t.Deadline > DateTimeOffset.Now).Take(3).ToList())
            {
                tasks.Add(toClientTask(task));
            }
            return Ok(tasks);
        }


        // GET: api/Jobs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask([FromRoute] int id)
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

        [HttpGet("withbusiness/{taskId}")]
        public async Task<IActionResult> GetTaskWithBusiness([FromRoute] int taskId)
        {
            var task = await _context.Task.Include(t => t.Business).SingleOrDefaultAsync(m => m.Id == taskId);

            if (task == null)
            {
                return NotFound();
            }

            return Ok(toClientTask(task));
        }

        // PUT: api/Jobs/5
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> PutTask([FromBody] Models.Task task)
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

            return Ok(toClientTask(serverTask));
        }

        // POST: api/Jobs
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostTask([FromBody] Models.Task t)
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

            return Created("", toClientTask(task));
        }

        // DELETE: api/Jobs/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTask([FromRoute] int id)
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

        private async Task<Business> getBusiness()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            return await _context.Business.Include(b => b.Tasks).FirstOrDefaultAsync(b => b.UserId == user.Id);
        }

        private bool JobExists(int id)
        {
            return _context.Task.Any(e => e.Id == id);
        }

        static public dynamic toClientTask(Models.Task t, bool join = true)
        {
            
            var solutions = new List<dynamic>();
            if(t.Solutions != null && join)
            {
                foreach (var Solution in t.Solutions)
                {
                    solutions.Add(SolutionController.toClientSolution(Solution));
                }
            }
            

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
                business = t.Business == null || !join ? null : BusinessesController.toClientBusiness(t.Business, incUser: false, join: false),
                address = t.Address,
                zip = t.Zip,
                city = t.City,
                creationTime = t.CreationTime,
                contactDescription = t.ContactDescription,
                winnerSolutionId = t.WinnerSolutionId,
                winnerSolution = t.WinnerSolution == null || !join ? null : SolutionController.toClientSolution(t.WinnerSolution, join: false),
                solutions = solutions
            };
        }
    }
}