import { Component, ViewChild } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    constructor(private accountService: AccountService) {

    }

    username: string = "";
    password: string = "";
    @ViewChild('f') form: any;

    onLogin() {
        if (this.form.valid) {
            this.accountService.login(this.username, this.password);
        }
    }
}
