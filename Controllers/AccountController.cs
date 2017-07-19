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
using Microsoft.AspNetCore.Authorization;
using System.Dynamic;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using Microsoft.AspNetCore.Cors;

namespace CaseSite.Controllers
{
    [Produces("application/json")]
    [Route("api/Account")]
    public class AccountController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _loginManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UnifactoContext _context;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> loginManager, RoleManager<IdentityRole> roleManager, UnifactoContext context)
        {
            _userManager = userManager;
            _loginManager = loginManager;
            _roleManager = roleManager;
            _context = context;
        }

        [HttpPost("changepassword")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] JObject obj)
        {
            string currentPassword = obj["currentPassword"].ToString();
            string newPassword = obj["newPassword"].ToString();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if(user == null)
            {
                return NotFound(new { userError = "user not found" });
            }
            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            if (!result.Succeeded)
            {
                return BadRequest(new { passwordError = "password change failed" });
            }
            return Ok();
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
            mimeMessage.From.Add(new MailboxAddress("Unifacto Noreply", "noreply@unifacto.com"));
            mimeMessage.To.Add(new MailboxAddress("customer", email));
            mimeMessage.Subject = "Nulstil kodeord til Unifacto";
            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = "Nulstil dit kodeord til Unifacto igennem dette <a href='" + callbackUrl + "'>link</a>";
            mimeMessage.Body = bodyBuilder.ToMessageBody();
            using(var client = new SmtpClient())
            {
                client.Connect("smtp.office365.com", 587, false);
                client.Authenticate("noreply@unifacto.com", "Isbil42panda");
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
        public async Task<IActionResult> Status()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if(user == null)
                return Ok(new { role = "void" });
            else if (await _userManager.IsInRoleAsync(user, "business"))
                return Ok(new { role = "business" });
            else if (await _userManager.IsInRoleAsync(user, "student"))
                return Ok(new { role = "student" });
            return Ok(new { role = "void" });
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

        [HttpGet("externallogin")]
        [AllowAnonymous]
        public IActionResult ExternalLogin(string provider)
        {
            // Request a redirect to the external login provider.
            
            
            var properties = _loginManager.ConfigureExternalAuthenticationProperties(provider, "/api/account/externallogincallback");
            return Challenge(properties, provider);
        }

        [HttpGet("externallogincallback")]
        [AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback()
        {
            var info = await _loginManager.GetExternalLoginInfoAsync();
            var result = await _loginManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);
            if (result.Succeeded)
            {
                return Redirect("/login");
            }
            else
            {
                // If the user does not have an account, then ask the user to create an account.
                if (!await _roleManager.RoleExistsAsync("student"))
                {
                    IdentityRole role = new IdentityRole();
                    role.Name = "student";
                    await _roleManager.CreateAsync(role);
                }
                var email = info.Principal.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress").Value;
                
                var user = new IdentityUser { UserName = email, Email = email };
                var result2 = await _userManager.CreateAsync(user);
                if (result2.Succeeded)
                {
                    result2 = await _userManager.AddLoginAsync(user, info);
                    if (result2.Succeeded)
                    {
                        result2 = await _userManager.AddToRoleAsync(user, "student");
                        if (result2.Succeeded)
                        {
                            await _loginManager.SignInAsync(user, isPersistent: false);
                            var student = new Student();
                            student.Firstname = info.Principal.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname").Value;
                            student.Lastname = info.Principal.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname").Value;
                            student.FacebookId = info.Principal.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
                            student.UserId = user.Id;
                            var result3 = await new StudentController(_context, _userManager).PostStudent(student);
                            if (result3 != "success")
                                return BadRequest(result);
                            return Redirect("/login");
                        }
                    }
                }
                return BadRequest(result2.Errors);
            }
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
                IdentityRole role = new IdentityRole();
                role.Name = "business";
                await _roleManager.CreateAsync(role);
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

        [HttpPost("register/role/{roleName}")]
        public async Task<IActionResult> createRole([FromRoute] string roleName)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (await _roleManager.RoleExistsAsync(roleName))
            {
                ModelState.AddModelError("RoleError", "Role already exists");
                return BadRequest(ModelState);
            }
            IdentityRole role = new IdentityRole();
            role.Name = roleName;
            var result = await _roleManager.CreateAsync(role);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            return Ok();
        }

    }
}


//[HttpPost("fblogin")]
//[IgnoreAntiforgeryToken]
//public async Task<IActionResult> FacebookLogin([FromBody] string facebookId)
//{
//    var student = await _context.Student.SingleOrDefaultAsync(s => s.FacebookId == facebookId);
//    if(student == null)
//    {
//        return BadRequest(new { usererror = "User not found"});
//    }
//    return Json(new { Id = student.Id, Firstname = student.Firstname, Lastname = student.Lastname, Tasks = student.Tasks, UserId = student.UserId, FacebookId = facebookId });
//}

//[HttpPost("registerstudentuser")]
//public async Task<IActionResult> RegisterStudent([FromBody] User obj)
//{
//    if (!ModelState.IsValid)
//    {
//        return BadRequest(ModelState);
//    }
//    if (!await _roleManager.RoleExistsAsync("student"))
//    {
//        IdentityRole role = new IdentityRole();
//        role.Name = "student";
//        await _roleManager.CreateAsync(role);
//    }
//    IdentityUser user = new IdentityUser();
//    user.UserName = obj.UserName;
//    user.Email = obj.Email;

//    var result = await _userManager.CreateAsync(user, obj.Password);
//    if (!result.Succeeded)
//    {
//        return BadRequest(result.Errors);
//    }

//    IdentityResult roleResult = await _userManager.AddToRoleAsync(user, "student");
//    if (!roleResult.Succeeded)
//    {
//        return BadRequest(result.Errors);
//    }

//    return Ok(user.Id);
//}