import { Component, AfterViewInit } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'changepassword',
    templateUrl: './changepassword.component.html',
    styleUrls: ['./changepassword.component.css']
})
export class ChangePasswordComponent implements AfterViewInit {

    currentPassword: string = "";
    newPassword: string = "";
    confirmPassword: string = "";

    constructor(private accountService: AccountService) {

    }

    ngAfterViewInit() {
    }

    onSubmit() {
        this.accountService.changePassword(this.currentPassword, this.newPassword).subscribe(res => {
            console.log(res);
        });
    }
}