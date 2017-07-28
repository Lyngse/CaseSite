import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../services/account.service';
import { StudentService } from '../services/student.service';
import { UtilService } from '../services/util.service';

@Component({
    selector: 'admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements AfterViewInit {
    username: string = "";
    password: string = "";
    @ViewChild('f') form: any;

    constructor(private accountService: AccountService, private studentService: StudentService, private utilService: UtilService, private router: Router, private activateRoute: ActivatedRoute) {

    }

    ngAfterViewInit() {

    }

    onLogin() {
        if (this.form.valid) {
            this.utilService.loading.next(true);
            this.accountService.adminLogin(this.username, this.password).subscribe((response) => {
                this.utilService.loading.next(false);
                console.log(response);
                if (response.ok == true) {
                    this.utilService.alert.next({ type: "success", titel: "Success", message: "Login lykkedes" });
                    this.router.navigate(['/admin']);
                } else {
                    this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Login mislykkedes" });
                }
            }, (err) => {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Login mislykkedes" });
            });
        }
    }

}
