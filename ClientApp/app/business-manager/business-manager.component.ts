import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../services/business.service';
import { AccountService } from '../services/account.service';
import { JobService } from '../services/job.service';
import { Router } from '@angular/router';
import { ToasterService, ToasterConfig, Toast } from 'angular2-toaster';
import { Job } from '../model/job';

@Component({
    selector: 'business-manager',
    templateUrl: './business-manager.component.html',
    styleUrls: ['./business-manager.component.css']
})
export class BusinessManagerComponent{

    jobs: Job[];

    constructor(private businessService: BusinessService,
        private accountService: AccountService,
        private jobService: JobService,
        private router: Router,
        private toasterService: ToasterService) {

    }

    getInfo() {
        this.businessService.getBusinessInfo()
            .subscribe((response) => {
                console.log(response);
        }, (err) => console.log(err));
    }

    ngAfterViewInit() {
        this.jobService.getJobsForBusiness().subscribe((data) => {
            console.log(data);
            this.jobs = data;
        }, (err) => {
            if (err.status === 401)
                this.router.navigateByUrl("login");
            else
                console.log(err);
        });
    }

}
