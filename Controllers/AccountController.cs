using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using CaseSite.Models;
using MailKit.Net.Smtp;
using MimeKit;
using Newtonsoft.Json.Linq;

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

        [HttpPost("forgotpassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.FindByEmailAsync(email);
            if(user == null)
            {
                return Ok();
            }
            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            var callbackUrl = Url.Action("resetpassword", "login", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
            var mimeMessage = new MimeMessage();
            mimeMessage.From.Add(new MailboxAddress("Email from ASP.Net core 1.1", "frederik.bl@live.dk"));
            mimeMessage.To.Add(new MailboxAddress("Microsoft ASP.NET core", "frederik.bl@live.dk"));
            mimeMessage.Subject = "Reset password";
            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = "Please reset your password by clicking here: <a href='" + callbackUrl + "'>link</a>";
            mimeMessage.Body = bodyBuilder.ToMessageBody();
            using(var client = new SmtpClient())
            {
                client.Connect("smtp.live.com", 587, false);
                client.Authenticate("frederik.bl@live.dk", "3og5er8.0");
                client.Send(mimeMessage);
                client.Disconnect(true);
            }
            return Ok();
        }

        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword([FromBody] JObject obj)
        {
            string userId = obj["userId"].ToString();
            string code = obj["code"].ToString();
            string newPassword = obj["newPassword"].ToString();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.FindByIdAsync(userId);
            await _userManager.ResetPasswordAsync(user, code, newPassword);
            return Ok();
        }

        [HttpGet("status")]
        public IActionResult Status()
        {
        return Ok(_loginManager.IsSignedIn(HttpContext.User));
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

        //used by startup.cs to update tokens
        [HttpGet("updateTokens")]
        public IActionResult updateTokens()
        {
            return Ok();
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