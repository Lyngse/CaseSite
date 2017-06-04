import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { BusinessService } from '../../services/business.service';
import { Business } from '../../model/business';
import { Router } from '@angular/router';

@Component({
    selector: 'shared-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    business: Business;
    loading: boolean = false;

    constructor(private accountService: AccountService, private businessService: BusinessService, private router: Router) {

    }

    ngOnInit() {
        this.loading = true;
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.business = res;
            this.loading = false;
        }, err => {
            if (err.status !== 401)
                console.log(err);
            this.loading = false;
        });
    }

    logout() {
        this.loading = true;
        this.accountService.logout().subscribe((response) => { console.log(response); this.loading = false; this.router.navigate(['/business']); });
    }
}
