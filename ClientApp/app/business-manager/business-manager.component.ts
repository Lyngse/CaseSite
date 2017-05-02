import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../services/business.service';
import { AccountService } from '../services/account.service';
import { JobService } from '../services/job.service';

@Component({
    selector: 'business-manager',
    templateUrl: './business-manager.component.html',
    styleUrls: ['./business-manager.component.css']
})
export class BusinessManagerComponent{
    constructor(private businessService: BusinessService, private accountService: AccountService, private jobService: JobService) {

    }
    getInfo() {
        this.businessService.getBusinessInfo().then((response) => { console.log(response) });
    }

    ngAfterViewInit() {
        this.jobService.getJobsForBusiness().then((response) => {
            console.log(response);
        })
    }

}
