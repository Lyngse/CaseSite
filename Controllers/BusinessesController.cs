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
    [Route("api/Businesses")]
    public class BusinessesController : Controller
    {
        private readonly UnifactoContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public BusinessesController(UnifactoContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBusinessFromId([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var business = await _context.Business.SingleOrDefaultAsync(b => b.Id == id);

            if (business == null)
            {
                return NotFound();
            }

            return Ok(toClientBusiness(business, false));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetBusinessFromUser()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if(user == null)
            {
                return NotFound(new { userError = "user not found" });
            }



            var business = await _context.Business.SingleOrDefaultAsync(b => b.UserId == user.Id);

            if (business == null)
            {
                return NotFound();
            }

            return Ok(toClientBusiness(business));
        }

        [HttpGet("withtasks")]
        [Authorize]
        public async Task<IActionResult> GetBusinessWithTasks()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user == null)
            {
                return NotFound(new { userError = "user not found" });
            }

            var business = await _context.Business.Include(b => b.Tasks).SingleOrDefaultAsync(b => b.UserId == user.Id);

            if (business == null)
            {
                return NotFound();
            }

            return Ok(toClientBusiness(business));
        }

        // PUT: api/Businesses
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> PutBusiness([FromBody] JObject obj)
        {
            Business business = obj["business"].ToObject<Business>();
            User user = obj["user"].ToObject<User>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var serverUser = await _userManager.GetUserAsync(HttpContext.User);

            if (serverUser == null)
            {
                return NotFound(new { userError = "user not found" });
            }

            serverUser.UserName = user.UserName;
            serverUser.Email = user.Email;

            await _userManager.UpdateAsync(serverUser);

            var serverBusiness = await _context.Business.SingleOrDefaultAsync(b => b.UserId == serverUser.Id);

            if(serverBusiness == null)
            {
                return NotFound();
            }

            serverBusiness.Name = business.Name;
            serverBusiness.Description = business.Description;
            serverBusiness.Address = business.Address;
            serverBusiness.City = business.City;
            serverBusiness.Zip = business.Zip;

            _context.Entry(serverBusiness).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();

            return Ok(toClientBusiness(serverBusiness));
        }

        // POST: api/Businesses
        [HttpPost]
        public async Task<IActionResult> PostBusiness([FromBody] Business business)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == business.UserId);
            if (user == null)
            {
                return BadRequest(new { usererror = "user not found" });
            }
            business.User = user;
            _context.Business.Add(business);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBusiness", new { id = business.Id }, toClientBusiness(business));
        }

        // DELETE: api/Businesses/5
        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteBusiness()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user == null)
            {
                return NotFound(new { userError = "user not found" });
            }

            var business = await _context.Business.SingleOrDefaultAsync(b => b.UserId == user.Id);
            if (business == null)
            {
                return NotFound();
            }

            _context.Business.Remove(business);
            await _context.SaveChangesAsync();

            return Ok(toClientBusiness(business));
        }

        static public dynamic toClientBusiness(Business business, bool incUser = true, bool join = true)
        {
            dynamic result = new ExpandoObject();
            result.id = business.Id;
            result.name = business.Name;
            result.description = business.Description;
            result.address = business.Address;
            result.city = business.City;
            result.zip = business.Zip;
            result.logoUrl = business.LogoUrl;

            var tasks = new List<dynamic>();
            if(business.Tasks != null && join)
            {
                foreach (var task in business.Tasks)
                {
                    tasks.Add(TasksController.toClientTask(task, join: false));
                }
            }
            result.tasks = tasks;

            if (incUser)
            {
                result.username = business.User.UserName;
                result.email = business.User.Email;
            }

            return result;
        }
    }
}