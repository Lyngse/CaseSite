using System;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CaseSite.Models
{
    public class Job
    {
        //primary key
        public int Id { get; set; }
        
        public DateTimeOffset Deadline { get; set; }
        
        public string Title { get; set; }

        public string Desciption { get; set; }

        public int MaxNumPersons { get; set; }

        public int MinNumPersons { get; set; }

        public decimal RewardValue { get; set; }

        public int BusinessId { get; set; }

        public virtual Business Business { get; set; }
    }
}
