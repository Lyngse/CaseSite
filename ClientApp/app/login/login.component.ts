import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../services/account.service';
import { StudentService } from '../services/student.service';
import { UtilService } from '../services/util.service';
import { Student } from '../model/student';

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
    student: Student = new Student();
    error: string = "";

    constructor(private accountService: AccountService, private studentService: StudentService, private utilService: UtilService, private router: Router, private activateRoute: ActivatedRoute) {
        this.accountService.loggedIn.subscribe(newValue => {
            if (newValue === "business")
                this.router.navigate(['/business']);
            if (newValue === "student")
                this.studentService.getStudentFromUser().subscribe(res => {
                    console.log(res);
                    this.student = res;
                });
        });
    }

    ngAfterViewInit() {
        this.activateRoute.queryParams.subscribe(params => {
            let error = params['error'];
            if (error) {
                switch (error) {
                    case 'noemail':
                        this.error = "Du skal give os lov til at bruge din email. Gå ind på dine facebook appinstillinger, fjern unifacto og prøv igen"
                        break;
                    default:
                        this.error = "noget gik galt: " + error;
                        break;
                }
            }
        })
    }

    onLogin() {
        if (this.form.valid) {
            this.utilService.loading.next(true);
            this.accountService.login(this.username, this.password).subscribe((response) => {
                this.utilService.loading.next(false);
                console.log(response);
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

    forgotPassword() {
        this.router.navigate(['/login/forgot-password']);
    }

    fblogout() {
        this.accountService.logout().subscribe(res => {
            console.log(res);
        })
    }
}
