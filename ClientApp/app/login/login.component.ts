import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

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

    constructor(private accountService: AccountService, private router: Router) {
        this.accountService.loggedIn.subscribe(newValue => {
            if (newValue)
                this.router.navigate(['/business']);
        });
    }

    ngAfterViewInit() {
        
    }

    onLogin() {
        if (this.form.valid) {
            this.loading = true;
            this.accountService.login(this.username, this.password).subscribe((response) => {
                if (response.ok == true) {
                    this.loading = false;
                    this.router.navigate(['/business']);
                } else {
                    this.loading = false;
                    this.loginFailedMsg = response._body;
                }
            }, (err) => {
                this.loading = false;
                console.log(err.json());
            });
        }
    }
}
