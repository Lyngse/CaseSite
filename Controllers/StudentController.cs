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

            return Ok(toClientStudent(student));
        }

        [HttpPost("registerstudent")]
        public async Task<IActionResult> PostStudent([FromBody] Student student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == student.UserId);
            if (user == null)
            {
                return BadRequest(new { usererror = "User not found" });
            }
            var serverStudent = await _context.Student.SingleOrDefaultAsync(s => s.FacebookId == student.FacebookId);
            if(serverStudent == null)
            {
                student.User = user;
                _context.Student.Add(student);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetStudent", new { id = student.Id }, toClientStudent(student));
            }
            return BadRequest(new { usererror = "Student already exists" });    
        }

        private dynamic toClientStudent(Student student, bool incUser = true)
        {
            dynamic result = new ExpandoObject();
            result.id = student.Id;
            result.firname = student.Firstname;
            result.lastname = student.Lastname;
            result.facebookId = student.FacebookId;


            if (incUser)
            {
                result.email = student.User.Email;
            }

            return result;
        }
    }
}