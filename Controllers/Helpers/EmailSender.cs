using CaseSite.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace CaseSite.Controllers.Helpers
{
    public class EmailSender
    {
        private IOptions<EmailCredentials> _emailCredentials;
        public EmailSender(IOptions<EmailCredentials> ec)
        {
            _emailCredentials = ec;
        }

        public void ResetPassword(string callbackUrl, string email)
        {
            SmtpClient client = new SmtpClient("smtp.office365.com", 587);
            client.UseDefaultCredentials = false;
            client.EnableSsl = true;
            client.Credentials = new NetworkCredential("noreply@unifacto.com", _emailCredentials.Value.Noreply);

            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("noreply@unifacto.com");
            mailMessage.To.Add(email);
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = "Nulstil dit kodeord til Unifacto igennem dette <a href='" + callbackUrl + "'>link</a>";
            mailMessage.Subject = "Nulstil kodeord til Unifacto";
            client.Send(mailMessage);
        }
    }
}
