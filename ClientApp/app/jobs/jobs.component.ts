import { Component,OnInit } from '@angular/core';
import { Job } from '../model/job';
import { JobService } from '../services/job.service'

@Component({
    selector: 'jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.css']
})
export class JobsComponent {
    jobs: Job[]

    constructor(private jobService: JobService) {

    }

    ngAfterViewInit() {
        this.jobService.getAllJobs().subscribe((data) => {
            console.log(data);
            this.jobs = data;
        }, (err) => {
            console.log(err);
        });
    }

}
