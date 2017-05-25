import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Business } from '../../model/business';
import { Job } from '../../model/job';
import { BusinessService } from '../../services/business.service';
import { JobService } from '../../services/job.service';
import * as moment from 'moment';

@Component({
    selector: 'job-detail',
    templateUrl: './job-detail.component.html',
    styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements AfterViewInit {
    job: Job;
    business: Business;

    constructor(
        private businessService: BusinessService,
        private jobService: JobService,
        private route: ActivatedRoute
    ) {

    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];
            this.jobService.getJob(id).subscribe(res => {
                console.log(res);
                this.job = res;
                this.businessService.getBusinessFromId(res.businessId).subscribe(res => this.business = res);
            });

        })   
    }

    getDeadlineString() {
        if (this.job) {
            return this.job.deadline.fromNow();
        }
    }
}
