import { Component, AfterViewInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { BusinessService } from '../../services/business.service';
import { Business } from '../../model/business';

@Component({
    selector: 'shared-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
    business: Business;

    constructor(private accountService: AccountService, private businessService: BusinessService) {

    }

    ngAfterViewInit() {
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.business = res;
        }, err => {
            if (err.status !== 401)
                console.log(err);
        });
    }

    logout() {
        this.accountService.logout().subscribe((response) => { console.log(response); window.location.href = '/' });
    }
}
