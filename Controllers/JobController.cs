using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CaseSite.Models;
using System.Reflection;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CaseSite.Controllers
{
    [Route("api/[controller]")]
    public class JobController : Controller
    {
        private readonly IJobRepository _jobRepository;

        public JobController(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        [HttpGet]
        public IEnumerable<Job> GetAll()
        {
            return _jobRepository.GetAll();
        }

        [HttpGet("{id}", Name ="GetJob")]
        public IActionResult GetById(int id)
        {
            var job = _jobRepository.Find(id);
            if (job == null)
                return NotFound();
            return new ObjectResult(job);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Job job)
        {
            if(job == null)
            {
                return BadRequest();
            }

            _jobRepository.Add(job);

            return CreatedAtRoute("GetJob", new { id = job.Id }, job);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Job job)
        {
            if(job == null || job.Id != id)
            {
                return BadRequest();
            }

            if(_jobRepository.Find(id) == null)
            {
                return NotFound();
            }

            _jobRepository.Update(job);
            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var job = _jobRepository.Find(id);
            if(job == null)
            {
                return NotFound();
            }
            _jobRepository.Remove(id);
            return new NoContentResult();
        }
    }
}
