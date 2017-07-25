import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { BusinessService } from '../../services/business.service';
import { UtilService } from '../../services/util.service';
import { StudentService } from '../../services/student.service';
import { Business } from '../../model/business';
import { Student } from '../../model/student';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
    selector: 'shared-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    business: Business;
    student: Student;

    constructor(private utilService: UtilService, private accountService: AccountService, private businessService: BusinessService, private router: Router, private studentService: StudentService) {
        accountService.loggedIn.subscribe(newValue => {
            if (newValue === "business") {
                this.getBusiness();
                this.student = null;
            }
            else if (newValue === "student") {
                this.business = null;
                this.studentService.getStudentFromUser().subscribe(res => {
                    console.log(res);
                    this.student = res;
                });
            }
            else {
                this.business = null;
                this.student = null;
            }
                
        });
        this.accountService.loggedIn.subscribe(newValue => {
            
        });
    }

    ngOnInit() {
    }

    getUserImage() {
        if (this.student) {
            return "http://graph.facebook.com/" + this.student.facebookId + "/picture?type=square";
        }
    }

    getBusiness() {
        this.utilService.loading.next(true);
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.business = res;
            this.utilService.loading.next(false);
        }, err => {
            this.utilService.loading.next(false);
            if (err.status !== 401)
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
        });
    }

    logout() {
        this.utilService.loading.next(true);
        this.accountService.logout().subscribe((response) => {
            this.utilService.loading.next(false);
            this.router.navigate(['/']
            );
        }, err => {
            this.utilService.loading.next(true);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
        });
    }
}
