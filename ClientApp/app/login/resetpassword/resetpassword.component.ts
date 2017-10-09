import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'resetpassword',
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.css']
})
export class ResetPasswordComponent implements AfterViewInit {

    userId: string;
    code: string;
    newPassword: string;

    constructor(private activatedRoute: ActivatedRoute, private utilService: UtilService, private accountService: AccountService, private router: Router) {

    }

    ngAfterViewInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.userId = params['userId'];
            this.code = params['code'];
        });
    }

    onSubmit() {
        this.utilService.displayLoading(true);
        this.accountService.resetPassword(this.userId, this.code, this.newPassword).subscribe(res => {
            this.utilService.displayLoading(false);
            if (res.ok === true) {
                this.utilService.alert.next({ type: "success", titel: "Success", message: "Kodeord blev ændret" });
                this.router.navigate(['/login']);
            } else {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Ændring af kodeord mislykkedes" });
            }
        }, err => {
            this.utilService.displayLoading(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Ændring af kodeord mislykkedes" });
        });
    }
}