using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CaseSite.Models
{
    public class Business
    {
        
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public byte[] Logo { get; set; }

        public string UserId { get; set; }

        public virtual IdentityUser User { get; set; }

        public virtual ICollection<Job> Jobs { get; set; }
    }
}
