import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { BusinessService } from '../../services/business.service';
import { UtilService } from '../../services/util.service';
import { Business } from '../../model/business';
import { Router } from '@angular/router';

@Component({
    selector: 'shared-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    business: Business;

    constructor(private utilService: UtilService, private accountService: AccountService, private businessService: BusinessService, private router: Router) {
        accountService.loggedIn.subscribe(newValue => {
            if (newValue)
                this.getBusiness();
            else
                this.business = null;
        })
    }

    ngOnInit() {
    }

    getBusiness() {
        this.utilService.loading.next(true);
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.business = res;
            this.utilService.loading.next(false);
        }, err => {
            this.utilService.loading.next(true);
            if (err.status !== 401)
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
                console.log(err);
        });
    }

    logout() {
        this.utilService.loading.next(true);
        this.accountService.logout().subscribe((response) => {
            console.log(response);
            this.utilService.loading.next(false);
            this.router.navigate(['/']
            );
        }, err => {
            this.utilService.loading.next(true);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
        });
    }
}
