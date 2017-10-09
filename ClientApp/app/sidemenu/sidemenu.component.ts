import { Component, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { UtilService } from '../services/util.service';
import { BusinessService } from '../services/business.service';
import { StudentService } from '../services/student.service';
import { Business } from '../model/business';
import { Student } from '../model/student';


@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements AfterViewInit {
    business: Business;
    student: Student;
    isAdmin: boolean = false;
    showMenu: boolean = false;

    constructor(private accountService: AccountService, private router: Router, private utilService: UtilService, private studentService: StudentService, private businessService: BusinessService) {
        utilService.showSidemenu.subscribe(newValue => {
            if (newValue) {
                this.showMenu = true;
            }
            else {
                this.showMenu = false;
            }
        });
        this.accountService.loggedIn.subscribe(newValue => {
            if (newValue === "business") {
                this.getBusiness();
                this.student = null;
                this.isAdmin = false;
            }
            else if (newValue === "student") {
                this.business = null;
                this.isAdmin = false;
                this.studentService.getStudentFromUser().subscribe(res => {
                    console.log(res);
                    this.student = res;
                });
                this.accountService.updateToken();
            }
            else if (newValue === "admin") {
                this.isAdmin = true;
                this.business = null;
                this.student = null;
            }
            else {
                this.business = null;
                this.student = null;
                this.isAdmin = false;
            }               
        });
    }

    ngAfterViewInit() {
    }

    getUserImage() {
        if (this.student) {
            return "https://graph.facebook.com/" + this.student.facebookId + "/picture?type=square";
        }
    }

    logout() {
        this.utilService.loading.next(true);
        this.accountService.logout().subscribe((response) => {
            this.utilService.loading.next(false);
            this.router.navigate(['/']);
            this.isAdmin = false;
        }, err => {
            this.utilService.loading.next(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
        });
    }

    closeSideMenu() {
        this.showMenu = !this.showMenu;
        this.utilService.displaySideMenu(this.showMenu);
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

}
