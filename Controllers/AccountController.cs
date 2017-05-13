using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using CaseSite.Models;

namespace CaseSite.Controllers
{
    [Produces("application/json")]
    [Route("api/Account")]
    public class AccountController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _loginManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> loginManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _loginManager = loginManager;
            _roleManager = roleManager;
        }

        [HttpPost("logout")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> LogOut()
        {
            await _loginManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("login")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> LogIn([FromBody] LogIn loginInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _loginManager.PasswordSignInAsync(loginInfo.UserName, loginInfo.Password, false, false);
            if (!result.Succeeded)
            {
                return BadRequest(new { loginError = "login failed" });
            }
            return Ok();
            
        }

        [HttpPost("registerbusinessuser")]
        public async Task<IActionResult> RegisterBusiness([FromBody] User obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _roleManager.RoleExistsAsync("business"))
            {
                ModelState.AddModelError("RoleError", "Role not found");
                return BadRequest(ModelState);
            }
            IdentityUser user = new IdentityUser();
            user.UserName = obj.UserName;
            user.Email = obj.Email;

            var result = await _userManager.CreateAsync(user, obj.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            IdentityResult roleResult = await _userManager.AddToRoleAsync(user, "business");
            if (!roleResult.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(user.Id);
        }

        //[HttpPost("register/role/{roleName}")]
        //public async Task<IActionResult> createRole([FromRoute] string roleName)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    if (await _roleManager.RoleExistsAsync(roleName))
        //    {
        //        ModelState.AddModelError("RoleError", "Role already exists");
        //        return BadRequest(ModelState);
        //    }
        //    IdentityRole role = new IdentityRole();
        //    role.Name = roleName;
        //    var result = await _roleManager.CreateAsync(role);
        //    if (!result.Succeeded)
        //    {
        //        return BadRequest(result.Errors);
        //    }
        //    return Ok();
        //}

    }
}