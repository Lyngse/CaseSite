using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CaseSite.Models
{
    public class JobRepository : IJobRepository
    {
        private readonly JobContext _context;

        public JobRepository(JobContext context)
        {
            _context = context;

            if (_context.Jobs.Count() == 0)
            {
                Add(new Job { Deadline = DateTimeOffset.Now.AddDays(5), Disciption = "Vi har brug for hjælp!", MaxNumPersons = 2, MinNumPersons = 1, RewardValue = 1500, Title = "1-2 studenter søges" });
                Add(new Job { Deadline = DateTimeOffset.Now.AddDays(10), Disciption = "Vi har brug for hjælp!", MaxNumPersons = 1, MinNumPersons = 1, RewardValue = 500, Title = "Grafisk opgave" });
                Add(new Job { Deadline = DateTimeOffset.Now.AddDays(15), Disciption = "Vi har brug for hjælp!", MaxNumPersons = 4, MinNumPersons = 1, RewardValue = 2500, Title = "Målgruppeanalyse" });
            }

        }

        public void Add(Job job)
        {
            _context.Jobs.Add(job);
            _context.SaveChanges();
        }

        public Job Find(int id)
        {
            return _context.Jobs.FirstOrDefault(j => j.Id == id);
        }

        public IEnumerable<Job> GetAll()
        {
            return _context.Jobs.ToList();
        }

        public void Remove(int id)
        {
            var entity = _context.Jobs.First(j => j.Id == id);
            _context.Jobs.Remove(entity);
            _context.SaveChanges();
        }

        public void Update(Job job)
        {
            _context.Jobs.Update(job);
            _context.SaveChanges();
        }
    }
}
