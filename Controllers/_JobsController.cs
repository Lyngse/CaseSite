using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CaseSite.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CaseSite.Controllers
{
    [Route("api/[controller]")]
    public class _JobsController : Controller
    {
        private static Models.Job[] _jobs = new Job[]
        {
            new Job{ Deadline = DateTimeOffset.Now.AddDays(5), Disciption = "Vi har brug for hjælp!", MaxNumPersons = 2, MinNumPersons = 1, RewardValue = 1500, Title = "1-2 studenter søges" },
            new Job{ Deadline = DateTimeOffset.Now.AddDays(10), Disciption = "Vi har brug for hjælp!", MaxNumPersons = 1, MinNumPersons = 1, RewardValue = 500, Title = "Grafisk opgave" },
            new Job{ Deadline = DateTimeOffset.Now.AddDays(15), Disciption = "Vi har brug for hjælp!", MaxNumPersons = 4, MinNumPersons = 1, RewardValue = 2500, Title = "Målgruppeanalyse" }
        };
        
        [HttpGet("[action]")]
        public IActionResult GetJobs()
        {
            return new ObjectResult(_jobs);
        }
    }
}
