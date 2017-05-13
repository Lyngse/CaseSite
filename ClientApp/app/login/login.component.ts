import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    constructor(private accountService: AccountService, private router: Router) {

    }

    username: string = "";
    password: string = "";
    loginFailedMsg: string = "";
    @ViewChild('f') form: any;

    onLogin() {
        if (this.form.valid) {
            this.accountService.login(this.username, this.password).subscribe((response) => {
                if (response.ok == true) {
                    window.location.href = '/business';
                    //this.router.navigate(['/business']);
                } else {
                    this.loginFailedMsg = response._body;
                }
            });
        }
    }
}
