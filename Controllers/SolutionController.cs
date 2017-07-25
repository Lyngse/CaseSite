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
using System;

namespace CaseSite.Controllers
{
    [Produces("application/json")]
    [Route("api/Solutions")]
    public class SolutionController : Controller
    {
        private readonly UnifactoContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public SolutionController(UnifactoContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("createsolution")]
        public async Task<IActionResult> CreateSolution([FromBody] JObject obj)
        {
            int studentId = (int)obj["studentId"];
            int taskId = (int)obj["taskId"];

            var student = await _context.Student.SingleOrDefaultAsync(s => s.Id == studentId);
            if(student == null)
            {
                return NotFound(new { studentError = "Student not found" });
            }

            var task = await _context.Task.SingleOrDefaultAsync(t => t.Id == taskId);
            if(task == null)
            {
                return NotFound(new { taskError = "Task not found" });
            }

            var serverSolution = await _context.Solution.SingleOrDefaultAsync(s => s.StudentId == studentId && s.TaskId == taskId);
            if(serverSolution == null)
            {
                Solution solution = new Solution();
                solution.Student = student;
                solution.StudentId = student.Id;
                solution.Task = task;
                solution.TaskId = task.Id;
                solution = _context.Solution.Add(solution).Entity;
                student.Solutions.Add(solution);
                task.Solutions.Add(solution);
                _context.Entry(student).State = EntityState.Modified;
                _context.Entry(task).State = EntityState.Modified;
                await _context.SaveChangesAsync();


                return Created("", toClientSolution(solution));
            }
            return Ok();
        }


        [HttpGet("gettasksolutions/{taskId}")]
        public async Task<IActionResult> GetTaskSolutions([FromRoute] int taskId)
        {
            var business = await getBusiness();
            if(business == null)
            {
                return NotFound(new { businessError = "Business not found" });
            }

            var task = await _context.Task.SingleOrDefaultAsync(t => t.Id == taskId);
            if(task == null)
            {
                return NotFound(new { taskError = "Task not found" });
            }

            if(task.BusinessId == business.Id)
            {
                var solutions = await _context.Solution.Where(s => s.TaskId == task.Id).ToListAsync();
                if(solutions == null)
                {
                    return NotFound(new { solutionError = "Solutions not found" });
                }
                task.Solutions = solutions;
                return Ok(task.Solutions);
            }

            return NotFound(new { notAllowed = "Not allowed" });
        }

        [HttpGet("getstudentsolutions")]
        public async Task<IActionResult> GetStudentSolutions()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var student = await _context.Student.FirstOrDefaultAsync(s => s.UserId == user.Id);
            List<Solution> solutions = await _context.Solution.Include(so => so.Task).Where(so => so.StudentId == student.Id).ToListAsync();
            if (student == null)
            {
                return NotFound(new { studentError = "Student not found" });
            }

            return Ok(solutions);
        }

        [HttpPost("selectwinner")]
        public async Task<IActionResult> SelectWinner([FromBody] JObject obj)
        {
            int taskId = (int)obj["taskId"];
            int studentId = (int)obj["studentId"];

            var student = await _context.Student.SingleOrDefaultAsync(s => s.Id == studentId);
            if (student == null)
            {
                return NotFound(new { studentError = "Student not found" });
            }

            var task = await _context.Task.SingleOrDefaultAsync(t => t.Id == taskId);
            if (task == null)
            {
                return NotFound(new { taskError = "Task not found" });
            }

            var solutions = await _context.Solution.Where(s => s.TaskId == task.Id).ToListAsync();
            if(solutions == null)
            {
                return NotFound(new { solutionError = "No solutions found" });
            }
            DateTime now = DateTime.Now;
            if (task.Deadline < now)
            {
                bool isWinnerSelected = false;
                foreach (var s in solutions)
                {
                    if (s.Task.WinnerSolutionId != null)
                    {
                        isWinnerSelected = true;
                        return NotFound(new { solutionError = "Winner have already been selected" });
                    }
                }
                if (isWinnerSelected == false)
                {
                    var solution = await _context.Solution.SingleOrDefaultAsync(s => s.StudentId == student.Id && s.TaskId == task.Id);
                    if (solution == null)
                    {
                        return NotFound(new { solutionError = "Solution not found" });
                    }

                    task.WinnerSolutionId = solution.Id;
                    task.WinnerSolution = solution;
                    _context.Entry(task).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return NotFound(new { solutionError = "Winner have already been selected" });
                }
            }
            else
            {
                return NotFound(new { deadlineError = "Deadline not passed" });
            }

        }

        private async Task<Student> getStudent()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            return await _context.Student.Include(s => s.Solutions).FirstOrDefaultAsync(b => b.UserId == user.Id);
        }

        private async Task<Business> getBusiness()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            return await _context.Business.Include(b => b.Tasks).FirstOrDefaultAsync(b => b.UserId == user.Id);
        }

        static public dynamic toClientSolution(Solution s, bool join = true)
        {
            return new
            {
                id = s.Id,
                task = s.Task == null || !join ? null : TasksController.toClientTask(s.Task, join: false),
                taskId = s.TaskId,
                student = s.Student == null || !join ? null : StudentController.toClientStudent(s.Student, incUser: false, join: false),
                studentId = s.StudentId
            };
            
        }
    }
}