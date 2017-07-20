using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CaseSite.Models
{
    public class Student
    {

        public int Id { get; set; }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string FacebookId { get; set; }

        public string UserId { get; set; }

        public virtual IdentityUser User { get; set; }

        public virtual ICollection<Solution> Solutions { get; set; }

    }
}
