import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'changepassword',
    templateUrl: './changepassword.component.html',
    styleUrls: ['./changepassword.component.css']
})
export class ChangePasswordComponent implements AfterViewInit {
    currentPassword: string = "";
    newPassword: string = "";
    confirmPassword: string = "";

    constructor(private accountService: AccountService, private utilService: UtilService, private router: Router) {

    }

    ngAfterViewInit() {
    }

    onSubmit() {
        this.utilService.displayLoading(true);
        this.accountService.changePassword(this.currentPassword, this.newPassword).subscribe(res => {
            this.utilService.displayLoading(false);
            if (res.ok === true) {
                this.utilService.alert.next({ type: "success", titel: "Success", message: "Kodeord blev ændret" });
                this.router.navigate(['/business']);
            } else {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Ændring af kodeord mislykkedes" });
            }
        }, err => {
            this.utilService.displayLoading(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Ændring af kodeord mislykkedes" });
        });
    }
}