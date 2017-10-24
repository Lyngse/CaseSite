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
using Microsoft.Extensions.Logging;

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
        private readonly ILogger<AccountController> _logger;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> loginManager, 
            RoleManager<IdentityRole> roleManager, UnifactoContext context, ILogger<AccountController> logger)
        {
            _userManager = userManager;
            _loginManager = loginManager;
            _roleManager = roleManager;
            _context = context;
            _logger = logger;
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
                return BadRequest(new { passwordError = "password change failed", errors = result.Errors });
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
            var callbackUrl = Url.Action("reset-password", "login", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
            var mimeMessage = new MimeMessage();
            //mimeMessage.From.Add(new MailboxAddress("Unifacto Noreply", "noreply@unifacto.com"));
            mimeMessage.From.Add(new MailboxAddress("Unifacto Info", "info@unifacto.com"));
            mimeMessage.To.Add(new MailboxAddress("customer", email));
            mimeMessage.Subject = "Nulstil kodeord til Unifacto";
            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = "Nulstil dit kodeord til Unifacto igennem dette <a href='" + callbackUrl + "'>link</a>";
            mimeMessage.Body = bodyBuilder.ToMessageBody();
            using(var client = new SmtpClient())
            {
                client.Connect("smtp.office365.com", 587, false);
                //client.Authenticate("noreply@unifacto.com", "Isbil42panda");
                client.Authenticate("info@unifacto.com", "Unifacto10");
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
            var result = await _userManager.ResetPasswordAsync(user, code, newPassword);
            if(result.Succeeded)
            {
                return Ok();
            }

            return BadRequest(new { changePasswordError = "Something went wrong when changing your password", errors = result.Errors });
        }

        [HttpGet("status")]
        public async Task<IActionResult> Status()
        {
            //_logger.LogInformation("Getting status of logged in user");
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null)
            {
                //_logger.LogInformation("status: no user logged in");
                return Ok(new { role = "void" });
            }
            else if (await _userManager.IsInRoleAsync(user, "business"))
            {
                //_logger.LogInformation("status: business user logged in");
                return Ok(new { role = "business" });
            }
            else if (await _userManager.IsInRoleAsync(user, "student"))
            {
                //_logger.LogInformation("status: student user logged in");
                return Ok(new { role = "student" });
            }
            else if (await _userManager.IsInRoleAsync(user, "admin"))
            {
                //_logger.LogInformation("status: admin user logged in");
                return Ok(new { role = "admin" });
            }
            //_logger.LogWarning("status: user has no valid role");
            return Ok(new { role = "void" });
        }

        [HttpPost("logout")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> LogOut()
        {
            await _loginManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("adminlogin")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> AdminLogIn([FromBody] LogIn loginInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.FindByNameAsync(loginInfo.UserName);
            if (user == null || !(await _userManager.IsInRoleAsync(user, "admin")))
            {
                return BadRequest(new { loginError = "Login failed" });
            }
            var result = await _loginManager.PasswordSignInAsync(loginInfo.UserName, loginInfo.Password, false, false);
            if (!result.Succeeded)
            {
                return BadRequest(new { loginError = "Login failed" });
            }
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
            var user = await _userManager.FindByNameAsync(loginInfo.UserName);
            if (user == null || !(await _userManager.IsInRoleAsync(user, "business")))
            {
                return BadRequest(new { loginError = "login failed" });
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
            if (Request.Cookies["Identity.External"] != null)
                return RedirectToAction(nameof(ExternalLoginCallback));
            var properties = _loginManager.ConfigureExternalAuthenticationProperties(provider, "/api/account/externallogincallback");
            return Challenge(properties, provider);
        }

        [HttpGet("externallogincallback")]
        [AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback(string error_description = null)
        {
            if(error_description != null)
            {
                return Redirect("/login?error=" + error_description);
            }
            var info = await _loginManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                Response.Cookies.Delete("Identity.External");
                return RedirectToAction(nameof(ExternalLogin), new { provider = "Facebook" });
            }
            var result = await _loginManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);
            if (result.Succeeded)
            {
                return Redirect("/student");
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
                var emailClaim = info.Principal.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress");
                string email = null;
                if (emailClaim != null)
                    email = emailClaim.Value;
                var facebookId = info.Principal.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;

                var user = new IdentityUser { UserName = facebookId, Email = facebookId + "@facebook.com" };
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
                            student.FacebookId = facebookId;
                            student.Email = email;
                            student.UserId = user.Id;
                            var result3 = await new StudentController(_context, _userManager).PostStudent(student);
                            if (result3 != "success")
                            {
                                Response.Cookies.Delete("Identity.External");
                                return Redirect("/login?error=" + result3);
                            }
                            //result = await _loginManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);
                            //if (result.Succeeded)
                            //{
                               return Redirect("/student");
                            //}
                            //else
                            //{
                            //    return Redirect("/login?error=signInFailed");
                            //}
                            
                        }
                    }
                }
                Response.Cookies.Delete("Identity.External");
                return Redirect("/login?error=" + result2.Errors.First().Description);
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

        [HttpPost("registeradminuser")]
        public async Task<IActionResult> RegisterAdmin([FromBody] User obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _roleManager.RoleExistsAsync("admin"))
            {
                IdentityRole role = new IdentityRole();
                role.Name = "admin";
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
            IdentityResult roleResult = await _userManager.AddToRoleAsync(user, "admin");
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