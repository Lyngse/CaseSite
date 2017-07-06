import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { UtilService } from '../../services/util.service';

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
    constructor(private router: Router, private utilService: UtilService, private accountService: AccountService) {

    }

    ngAfterViewInit() {
    
    }

    onSubmit() {
        this.utilService.loading.next(true);
        this.accountService.forgotPassword(this.newEmail).subscribe(res => {
            this.utilService.loading.next(false);
            if (res.status == 200) {
                this.utilService.alert.next({ type: "success", titel: "Success", message: "Reset link er sendt til " + this.newEmail });
                this.form.reset();
            } else {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Kodeordet blev ikke resat" });
            }
        }, err => {
            this.utilService.loading.next(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Kodeordet blev ikke resat" });
        });
    }
}
