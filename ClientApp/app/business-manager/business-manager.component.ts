import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../services/business.service';
import { AccountService } from '../services/account.service';
import { JobService } from '../services/job.service';
import { Router } from '@angular/router';
import { ToasterService, ToasterConfig, Toast, ToasterContainerComponent } from 'angular2-toaster';

@Component({
    selector: 'business-manager',
    templateUrl: './business-manager.component.html',
    styleUrls: ['./business-manager.component.css']
})
export class BusinessManagerComponent{
    constructor(private businessService: BusinessService,
        private accountService: AccountService,
        private jobService: JobService,
        private router: Router,
        private toasterService: ToasterService) {

    }

    public config1: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-top-right'
    });

    popToast() {
        var toast: Toast = {
            type: 'info',
            title: 'Here is a Toast Title',
            body: 'Here is a Toast Body'
        };

        this.toasterService.pop(toast);
    }

    getInfo() {
        this.businessService.getBusinessInfo().then((response) => {
            if (response.status == 401) {
                this.router.navigate(['/login']);
            } else {

            }
        });
    }

    ngAfterViewInit() {
        this.jobService.getJobsForBusiness().then((response) => {
            console.log(response);
        })
    }

}
