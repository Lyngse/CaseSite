import { Component,OnInit } from '@angular/core';
import { Task } from '../model/job';
import { JobService } from '../services/job.service'

@Component({
    selector: 'jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
    jobs: Task[]
    loading: boolean = false;

    constructor(private jobService: JobService) {

    }

    ngOnInit() {
        this.loading = true;
        this.jobService.getAllJobs().subscribe((data) => {
            console.log(data);
            this.jobs = data;
            this.loading = false;
        }, (err) => {
            console.log(err);
            this.loading = false;
        });
    }

}
