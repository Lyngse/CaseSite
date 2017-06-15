import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'resetpassword',
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.css']
})
export class ResetPasswordComponent implements AfterViewInit {

    userId: string;
    code: string;
    newPassword: string;

    constructor(private activatedRoute: ActivatedRoute, private accountService: AccountService) {

    }

    ngAfterViewInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.userId = params['userId'];
            this.code = params['code'];
        });
    }

    onSubmit() {
        this.accountService.resetPassword(this.userId, this.code, this.newPassword).subscribe(res => {
            console.log(res);
        });
    }
}