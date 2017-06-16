import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'forgotpassword',
    templateUrl: './forgotpassword.component.html',
    styleUrls: ['./forgotpassword.component.css']
})
export class ForgotPasswordComponent implements AfterViewInit {
    newEmail: string;
    statusMessage: string;
    @ViewChild('f') form: any;
    loading: boolean = false;
    constructor(private router: Router, private accountService: AccountService) {

    }

    ngAfterViewInit() {
    
    }

    onSubmit() {
        this.loading = true;
        this.accountService.forgotPassword(this.newEmail).subscribe(res => {
            console.log(res);
            if (res.status == 200) {
                this.statusMessage = "Reset link er sendt til " + this.newEmail;
                this.form.reset();
                this.loading = false;
            } else {
                this.statusMessage = "Der skete en fejl.";
                this.loading = false;
            }
        });
    }
}
