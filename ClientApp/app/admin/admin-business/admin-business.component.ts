import { Component, AfterViewInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'admin-business',
    templateUrl: './admin-business.component.html',
    styleUrls: ['./admin-business.component.css']
})
export class AdminBusinessComponent implements AfterViewInit {

    constructor(private adminService: AdminService, private accountService: AccountService) {

    }

    ngAfterViewInit() {

    }
}
