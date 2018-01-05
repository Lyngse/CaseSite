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

        [HttpGet("getcounts")]
        [Authorize]
        public async Task<IActionResult> GetCounts()
        {
            int businessCount = await _context.Business.CountAsync();
            int studentCount = await _context.Student.CountAsync();
            int taskCount = await _context.Task.CountAsync();
            int solutionCount = await _context.Solution.CountAsync();

            List<dynamic> counts = new List<dynamic>();
            counts.Add(businessCount);
            counts.Add(studentCount);
            counts.Add(taskCount);
            counts.Add(solutionCount);

            return Ok(counts);
        }

        [HttpPost("getallstudents")]
        [Authorize]
        public async Task<IActionResult> GetAllStudents([FromBody] JObject obj)
        {
            string query = (string)obj["query"];
            var serverUser = await _userManager.GetUserAsync(HttpContext.User);
            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }

            if (await _userManager.IsInRoleAsync(serverUser, "admin"))
            {
                if (query == null)
                {
                    var students = await _context.Student.ToListAsync();
                    foreach (var s in students)
                    {
                        s.User = await _context.Users.SingleOrDefaultAsync(u => u.Id == s.UserId);
                        s.Solutions = await _context.Solution.Where(so => so.StudentId == s.Id).ToListAsync();
                        foreach (var so in s.Solutions)
                        {
                            so.Task = await _context.Task.SingleOrDefaultAsync(t => t.Id == so.TaskId);
                        }
                        StudentController.toClientStudent(s);
                    }
                    return Ok(students);
                }
                else
                {
                    query = query.ToLower();
                    var students = await _context.Student.Where(s => s.Firstname.ToLower().Contains(query) || s.Lastname.ToLower().Contains(query) || s.Id.ToString().Equals(query)).ToListAsync();
                    foreach (var s in students)
                    {
                        s.User = await _context.Users.SingleOrDefaultAsync(u => u.Id == s.UserId);
                        s.Solutions = await _context.Solution.Where(so => so.StudentId == s.Id).ToListAsync();
                        foreach (var so in s.Solutions)
                        {
                            so.Task = await _context.Task.SingleOrDefaultAsync(t => t.Id == so.TaskId);
                        }
                        StudentController.toClientStudent(s);
                    }
                    return Ok(students);
                }
            }
            return NotFound(new { roleError = "You need to be an admin to have access here" });
        }

        [HttpPost("getallbusinesses")]
        [Authorize]
        public async Task<IActionResult> GetAllBusinesses([FromBody] JObject obj)
        {
            string query = (string)obj["query"];
            var serverUser = await _userManager.GetUserAsync(HttpContext.User);
            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }
            if (await _userManager.IsInRoleAsync(serverUser, "admin"))
            {
                if (query == null)
                {
                    var businesses = await _context.Business.ToListAsync();
                    foreach (var b in businesses)
                    {
                        b.User = await _context.Users.SingleOrDefaultAsync(u => u.Id == b.UserId);
                        BusinessesController.toClientBusiness(b);
                    }
                    return Ok(businesses);
                } else
                {
                    query = query.ToLower();
                    var businesses = await _context.Business.Where(b => b.Name.ToLower().Contains(query) || b.Id.ToString().Equals(query)).ToListAsync();
                    foreach (var b in businesses)
                    {
                        b.User = await _context.Users.SingleOrDefaultAsync(u => u.Id == b.UserId);
                        BusinessesController.toClientBusiness(b);
                    }
                    return Ok(businesses);
                }
        }
            return NotFound(new { roleError ="You need to be an admin to have access here" });
        }

        [HttpPost("getalltasks")]
        [Authorize]
        public async Task<IActionResult> GetAllTasks([FromBody] JObject obj)
        {
            string query = (string)obj["query"];
            var serverUser = await _userManager.GetUserAsync(HttpContext.User);

            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }
            if (await _userManager.IsInRoleAsync(serverUser, "admin"))
            {
                if (query == null)
                {
                    var tasks = await _context.Task.ToListAsync();
                    foreach (var t in tasks)
                    {
                        t.Business = await _context.Business.SingleOrDefaultAsync(b => b.Id == t.BusinessId);
                        t.Solutions = await _context.Solution.Where(s => s.TaskId == t.Id).ToListAsync();
                        TasksController.toClientTask(t);
                    }
                    return Ok(tasks);
                }
                else
                {
                    query = query.ToLower();
                    var tasks = await _context.Task.Where(t => t.Title.ToLower().Contains(query) || t.Id.ToString().Equals(query) || t.Business.Name.ToLower().Contains(query) || t.Business.City.ToLower().Contains(query)).ToListAsync();
                    foreach (var t in tasks)
                    {
                        t.Business = await _context.Business.SingleOrDefaultAsync(b => b.Id == t.BusinessId);
                        t.Solutions = await _context.Solution.Where(s => s.TaskId == t.Id).ToListAsync();
                        TasksController.toClientTask(t);
                    }
                    return Ok(tasks);
                }
            }
            return NotFound(new { roleError = "You need to be an admin to have access here" });
        }

        [HttpPost("getallsolutions")]
        [Authorize]
        public async Task<IActionResult> GetAllSolutions([FromBody] JObject obj)
        {
            string query = (string)obj["query"];
            var serverUser = await _userManager.GetUserAsync(HttpContext.User);

            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }

            if (await _userManager.IsInRoleAsync(serverUser, "admin"))
            {
                if (query == null)
                {
                    var solutions = await _context.Solution.ToListAsync();
                    foreach (var s in solutions)
                    {
                        s.Student = await _context.Student.SingleOrDefaultAsync(st => st.Id == s.StudentId);
                        s.Task = await _context.Task.SingleOrDefaultAsync(t => t.Id == s.TaskId);
                        SolutionController.toClientSolution(s);
                    }
                    return Ok(solutions);
                }
                else
                {
                    query = query.ToLower();
                    var solutions = await _context.Solution.Where(s => (s.Student.Firstname + ' ' + s.Student.Lastname).Contains(query) || s.Student.Firstname.ToLower().Contains(query) || s.Student.Lastname.ToLower().Contains(query) || s.Task.Title.ToLower().Contains(query)).ToListAsync();
                    foreach (var s in solutions)
                    {
                        s.Student = await _context.Student.SingleOrDefaultAsync(st => st.Id == s.StudentId);
                        s.Task = await _context.Task.SingleOrDefaultAsync(t => t.Id == s.TaskId);
                        SolutionController.toClientSolution(s);
                    }
                    return Ok(solutions);
                }
            }
            return NotFound(new { roleError = "You need to be an admin to have access here" });
        }

        [HttpGet("getsolutionsforstudent/{taskId}/{studentId}")]
        [Authorize]
        public async Task<IActionResult> GetSolutionForStudent([FromRoute] int taskId, [FromRoute]int studentId)
        {
            var serverUser = await _userManager.GetUserAsync(HttpContext.User);

            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }
            if (await _userManager.IsInRoleAsync(serverUser, "admin"))
            {
                
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
            if (await _userManager.IsInRoleAsync(serverUser, "admin"))
            {
                var task = await _context.Task.Include(t => t.Solutions).SingleOrDefaultAsync(t => t.Id == taskId);
                if (task == null)
                {
                    return NotFound();
                }
                if (task.Solutions != null)
                {
                    return BadRequest(new { error = "tasks with solutions can not be deleted" });
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
            if (await _userManager.IsInRoleAsync(serverUser, "admin"))
            {
                var business = await _context.Business.SingleOrDefaultAsync(b => b.Id == businessId);
                if (business == null)
                {
                    return NotFound();
                }

                business.Tasks = await _context.Task.Where(t => t.BusinessId == business.Id).ToListAsync();

                if(business.Tasks.Count() > 0)
                {
                    foreach (var t in business.Tasks)
                    {
                        foreach (var s in t.Solutions)
                        {
                            _context.Solution.Remove(s);
                        }
                        _context.Task.Remove(t);
                    }
                }

                _context.Business.Remove(business);
                await _context.SaveChangesAsync();
                return Ok();
            }
            return NotFound(new { roleError = "You need to be an admin to have access here" });
        }

        //[HttpPut]
        //[Authorize]
        //public async Task<IActionResult> UpdateTask([FromBody] Models.Task task)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var serverUser = await _userManager.GetUserAsync(HttpContext.User);

        //    if (serverUser == null)
        //    {
        //        return NotFound(new { userError = "user not found" });
        //    }
        //    if (serverUser.Roles.ToString() == "admin")
        //    {
        //        var serverTask = await _context.Task.SingleOrDefaultAsync(j => j.Id == task.Id);

        //        if (serverTask == null)
        //        {
        //            return NotFound();
        //        }

        //        serverTask.Deadline = task.Deadline;
        //        serverTask.Description = task.Description;
        //        serverTask.Type = task.Type;
        //        serverTask.RewardValue = task.RewardValue;
        //        serverTask.Title = task.Title;
        //        serverTask.WorkPlace = task.WorkPlace;
        //        serverTask.Address = task.Address;
        //        serverTask.City = task.City;
        //        serverTask.ContactDescription = task.ContactDescription;
        //        serverTask.RewardType = task.RewardType;
        //        serverTask.Zip = task.Zip;
        //        serverTask.CreationTime = task.CreationTime;


        //        _context.Entry(serverTask).State = EntityState.Modified;

        //        await _context.SaveChangesAsync();

        //        return Ok(TasksController.toClientTask(serverTask));
        //    }
        //    return NotFound(new { roleError = "You need to be an admin to have access here" });
        //}

        //[HttpPut]
        //[Authorize]
        //public async Task<IActionResult> UpdateBusiness([FromBody] JObject obj)
        //{

        //    var serverUser = await _userManager.GetUserAsync(HttpContext.User);

        //    if (serverUser == null)
        //    {
        //        return NotFound(new { userError = "user not found" });
        //    }
        //    if (serverUser.Roles.ToString() == "admin")
        //    {
        //        Business business = obj["business"].ToObject<Business>();

        //        var serverBusiness = await _context.Business.SingleOrDefaultAsync(b => b.UserId == serverUser.Id);

        //        if (serverBusiness == null)
        //        {
        //            return NotFound( new { businessError = "Business not found" });
        //        }

        //        serverBusiness.Name = business.Name;
        //        serverBusiness.Description = business.Description;
        //        serverBusiness.Address = business.Address;
        //        serverBusiness.City = business.City;
        //        serverBusiness.Zip = business.Zip;

        //        _context.Entry(serverBusiness).State = EntityState.Modified;

        //        await _context.SaveChangesAsync();

        //        return Ok(BusinessesController.toClientBusiness(serverBusiness));
        //    }
        //    return NotFound(new { roleError = "You need to be an admin to have access here" });
        //}


    }
}