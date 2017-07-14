import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { UtilService } from '../services/util.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
    loading: boolean = false;
    username: string = "";
    password: string = "";
    loginFailedMsg: string = "";
    @ViewChild('f') form: any;

    constructor(private accountService: AccountService, private utilService: UtilService, private router: Router) {
        this.accountService.loggedIn.subscribe(newValue => {
            if (newValue)
                this.router.navigate(['/business']);
        });
    }

    ngAfterViewInit() {
        
    }

    onLogin() {
        if (this.form.valid) {
            this.utilService.loading.next(true);
            this.accountService.login(this.username, this.password).subscribe((response) => {
                this.utilService.loading.next(false);
                if (response.ok == true) {
                    this.utilService.alert.next({ type: "success", titel: "Success", message: "Login lykkedes" });
                    this.router.navigate(['/business']);
                } else {
                    this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Login mislykkedes" });
                }
            }, (err) => {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Login mislykkedes" });
            });
        }
    }

    newBusiness() {
        this.router.navigate(['/business/register']);
    }

    fblogin() {
        this.accountService.fblogin();
    }

    forgotPassword() {
        this.router.navigate(['/login/forgotpassword']);
    }
}
