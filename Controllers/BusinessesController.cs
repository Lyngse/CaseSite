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
    [Route("api/Businesses")]
    public class BusinessesController : Controller
    {
        private readonly CaseSiteContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public BusinessesController(CaseSiteContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Businesses
        //[HttpGet]
        //public IEnumerable<Business> GetBusiness()
        //{
        //    return _context.Business;
        //}

        // GET: api/Businesses/5
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetBusiness()
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

            return Ok(business);
        }

        // PUT: api/Businesses/5
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> PutBusiness([FromBody] Business business)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user == null)
            {
                return NotFound(new { userError = "user not found" });
            }

            var serverBusiness = await _context.Business.SingleOrDefaultAsync(b => b.UserId == user.Id);

            if(serverBusiness == null)
            {
                return NotFound();
            }

            if (serverBusiness.Id != business.Id)
            {
                return BadRequest();
            }

            _context.Entry(business).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();
            

            return NoContent();
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

            return CreatedAtAction("GetBusiness", new { id = business.Id }, simpleBusinessObject(business));
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

            return Ok(simpleBusinessObject(business));
        }

        private dynamic simpleBusinessObject(Business business)
        {
            return new { Id = business.Id, Name = business.Name, UserId = business.UserId };
        }
    }
}