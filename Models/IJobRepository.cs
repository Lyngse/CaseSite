using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CaseSite.Models
{
    public interface IJobRepository
    {
        void Add(Job job);
        IEnumerable<Job> GetAll();
        Job Find(int id);
        void Remove(int id);
        void Update(Job job);
    }
}
