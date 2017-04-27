using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CaseSite.Models
{
    public class Job
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        public DateTimeOffset Deadline { get; set; }

        public string Title { get; set; }

        public string Disciption { get; set; }

        public int MaxNumPersons { get; set; }

        public int MinNumPersons { get; set; }

        public decimal RewardValue { get; set; }
    }
}
