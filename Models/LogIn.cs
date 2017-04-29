using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CaseSite.Models
{
    public class LogIn
    {
        [Required]
        public string UserName;
        [Required]
        public string Password;
    }
}
