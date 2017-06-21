using System;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CaseSite.Models
{
    public class Task
    {
        //primary key
        public int Id { get; set; }
        
        public DateTimeOffset Deadline { get; set; }
        
        public string Title { get; set; }

        public string Description { get; set; }

        public string ContactDescription { get; set; }

        public string RewardType { get; set; }

        public decimal RewardValue { get; set; }

        public string WorkPlace { get; set; }

        public string Address { get; set; }

        public int Zip { get; set; }

        public string City { get; set; }

        public string Type { get; set; }

        public DateTimeOffset CreationTime { get; set; }

        public int BusinessId { get; set; }

        public virtual Business Business { get; set; }
    }
}
