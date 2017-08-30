using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CaseSite.Models
{
    public class Solution
    {

        public int Id { get; set; }
        
        public int TaskId { get; set; }
        [Required]
        public virtual Task Task { get; set; }
       
        public int StudentId { get; set; }
        [Required]
        public virtual Student Student { get; set; }

    }
}
