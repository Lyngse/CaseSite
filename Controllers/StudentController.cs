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
    [Route("api/Student")]
    public class StudentController : Controller
    {
        private readonly UnifactoContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public StudentController(UnifactoContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentFromId([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var student = await _context.Student.SingleOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                return NotFound();
            }

            student.Solutions = await _context.Solution.Where(s => s.StudentId == student.Id).ToListAsync();
            foreach (var s in student.Solutions)
            {
                s.Task = await _context.Task.SingleOrDefaultAsync(t => t.Id == s.TaskId);
            }

            return Ok(toClientStudent(student, false));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetStudentFromUser()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user == null)
            {
                return NotFound(new { userError = "user not found" });
            }

            var student = await _context.Student.SingleOrDefaultAsync(s => s.UserId == user.Id);

            if (student == null)
            {
                return NotFound();
            }

            student.Solutions = await _context.Solution.Where(s => s.StudentId == student.Id).ToListAsync();
            foreach (var s in student.Solutions)
            {
                s.Task = await _context.Task.SingleOrDefaultAsync(t => t.Id == s.TaskId);
            }

            return Ok(toClientStudent(student));
        }

        [HttpPost("registerstudent")]
        public async Task<string> PostStudent([FromBody] Student student)
        {
            if (!ModelState.IsValid)
            {
                return "BadRequest";
            }
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == student.UserId);
            if (user == null)
            {
                return "User not found";
            }
            var serverStudent = await _context.Student.SingleOrDefaultAsync(s => s.FacebookId == student.FacebookId);
            if(serverStudent == null)
            {
                student.User = user;
                student.TermsAccecpted = false;
                _context.Student.Add(student);
                await _context.SaveChangesAsync();

                return "success";
            }
            return "Student already exists";    
        }

        [HttpGet("studentacceptterms")]
        public async Task<IActionResult> StudentAcceptTerms()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user == null)
            {
                return NotFound(new { userError = "user not found" });
            }

            var student = await _context.Student.SingleOrDefaultAsync(s => s.UserId == user.Id);

            if (student == null)
            {
                return NotFound();
            }

            student.TermsAccecpted = true;

            _context.Entry(student).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(toClientStudent(student));
        }

        static public dynamic toClientStudent(Student student, bool incUser = true, bool join = true)
        {
            dynamic result = new ExpandoObject();
            result.id = student.Id;
            result.firstname = student.Firstname;
            result.lastname = student.Lastname;
            result.facebookId = student.FacebookId;
            result.termsAccepted = student.TermsAccecpted;
            result.email = student.Email;

            var solutions = new List<dynamic>();
            if(student.Solutions != null && join)
            {
                foreach (var solution in student.Solutions)
                {
                    solutions.Add(SolutionController.toClientSolution(solution, join: false));
                }
            }
            result.solutions = student.Solutions;

            return result;
        }
    }
}