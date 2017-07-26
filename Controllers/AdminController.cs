using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CaseSite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Dynamic;
using Newtonsoft.Json.Linq;

namespace CaseSite.Controllers
{
    [Produces("application/json")]
    [Route("api/Admin")]
    public class AdminController : Controller
    {
        private readonly UnifactoContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public AdminController(UnifactoContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("getallbusinesses")]
        [Authorize]
        public async Task<IActionResult> GetAllBusinesses(string query = "")
        {
            var serverUser = await _userManager.GetUserAsync(HttpContext.User);

            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }
            if(serverUser.Roles.ToString() == "admin")
            {
                if(query == "")
                {
                    var businesses = await _context.Business.ToListAsync();
                    foreach (var b in businesses)
                    {
                        BusinessesController.toClientBusiness(b);
                    }
                    return Ok(businesses);
                } else
                {
                    var businesses = await _context.Business.Where(b => b.Name.Contains(query) || b.Id.ToString().Equals(query)).ToListAsync();
                    foreach (var b in businesses)
                    {
                        BusinessesController.toClientBusiness(b);
                    }
                    return Ok(businesses);
                }
            }
            return NotFound(new { roleError ="You need to be an admin to have access here" });
        }

        [HttpGet("getalltasks")]
        [Authorize]
        public async Task<IActionResult> GetAllTasks(string query = "")
        {
            var serverUser = await _userManager.GetUserAsync(HttpContext.User);

            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }
            if (serverUser.Roles.ToString() == "admin")
            {
                if (query == "")
                {
                    var tasks = await _context.Task.ToListAsync();
                    foreach (var t in tasks)
                    {
                        TasksController.toClientTask(t);
                    }
                    return Ok(tasks);
                }
                else
                {
                    var tasks = await _context.Task.Where(t => t.Title.Contains(query) || t.Id.ToString().Equals(query) || t.Business.ToString().Contains(query)).ToListAsync();
                    foreach (var t in tasks)
                    {
                        TasksController.toClientTask(t);
                    }
                    return Ok(tasks);
                }
            }
            return NotFound(new { roleError = "You need to be an admin to have access here" });
        }

        [HttpDelete("deletetask/{taskId}")]
        [Authorize]
        public async Task<IActionResult> DeleteTask([FromRoute] int taskId)
        {
            var serverUser = await _userManager.GetUserAsync(HttpContext.User);

            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }
            if (serverUser.Roles.ToString() == "admin")
            {
                var task = await _context.Task.SingleOrDefaultAsync(t => t.Id == taskId);
                if (task == null)
                {
                    return NotFound();
                }

                _context.Task.Remove(task);
                await _context.SaveChangesAsync();

                return Ok(task);
            }
            return NotFound(new { roleError = "You need to be an admin to have access here" });
        }

        [HttpDelete("deletebusiness/{businessId}")]
        [Authorize]
        public async Task<IActionResult> DeleteBusiness([FromRoute] int businessId)
        {
            var serverUser = await _userManager.GetUserAsync(HttpContext.User);

            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }
            if (serverUser.Roles.ToString() == "admin")
            {
                var business = await _context.Business.SingleOrDefaultAsync(b => b.Id == businessId);
                if (business == null)
                {
                    return NotFound();
                }

                foreach(var t in business.Tasks)
                {
                    foreach (var s in t.Solutions)
                    {
                        _context.Solution.Remove(s);
                    }
                    _context.Task.Remove(t);
                }

                _context.Business.Remove(business);
                await _context.SaveChangesAsync();
            }
            return NotFound(new { roleError = "You need to be an admin to have access here" });
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateTask([FromBody] Models.Task task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var serverUser = await _userManager.GetUserAsync(HttpContext.User);

            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }
            if (serverUser.Roles.ToString() == "admin")
            {
                var serverTask = await _context.Task.SingleOrDefaultAsync(j => j.Id == task.Id);

                if (serverTask == null)
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

                return Ok(TasksController.toClientTask(serverTask));
            }
            return NotFound(new { roleError = "You need to be an admin to have access here" });
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateBusiness([FromBody] JObject obj)
        {

            var serverUser = await _userManager.GetUserAsync(HttpContext.User);

            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }
            if (serverUser.Roles.ToString() == "admin")
            {
                Business business = obj["business"].ToObject<Business>();

                var serverBusiness = await _context.Business.SingleOrDefaultAsync(b => b.UserId == serverUser.Id);

                if (serverBusiness == null)
                {
                    return NotFound( new { businessError = "Business not found" });
                }

                serverBusiness.Name = business.Name;
                serverBusiness.Description = business.Description;
                serverBusiness.Address = business.Address;
                serverBusiness.City = business.City;
                serverBusiness.Zip = business.Zip;

                _context.Entry(serverBusiness).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return Ok(BusinessesController.toClientBusiness(serverBusiness));
            }
            return NotFound(new { roleError = "You need to be an admin to have access here" });
        }


    }
}