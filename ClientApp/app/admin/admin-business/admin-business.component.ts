import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AccountService } from '../../services/account.service';
import { UtilService } from '../../services/util.service';
import { Business } from '../../model/business';

@Component({
    selector: 'admin-business',
    templateUrl: './admin-business.component.html',
    styleUrls: ['./admin-business.component.css']
})
export class AdminBusinessComponent implements AfterViewInit {
    query: string;
    businesses: Business[];

    constructor(private adminService: AdminService, private accountService: AccountService, private utilService: UtilService, private router: Router) {

    }

    ngAfterViewInit() {

    }


    search() {
        this.utilService.displayLoading(true);
        if (!this.query) {
            this.adminService.getAllBusinesses().subscribe(res => {
                this.businesses = res;
                this.utilService.displayLoading(false);
            }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved hentningen af virksomhederne" });
            });
        } else {
            this.adminService.searchBusiness(this.query).subscribe(res => {
                this.businesses = res;
                this.utilService.displayLoading(false);
            }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved hentningen af virksomhederne" });
            });
        }
    }

    gotoBusinessEdit(id) {
        this.router.navigate(['/business/settings/' + id]);
    }

    deleteBusiness(businessId) {
        this.utilService.displayLoading(true);
        this.adminService.deleteBusiness(businessId).subscribe(res => {
            if (res.ok) {
                this.utilService.alert.next({ type: "success", titel: "Succes", message: "Virksomheden er blevet slettet" });
                this.query = null;
                this.search();
            } else {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved sletningen af virksomheden" });
            }
        }, (err) => {
            this.utilService.displayLoading(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved sletningen af virksomheden" });
            });
    }
}
