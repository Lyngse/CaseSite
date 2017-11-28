import { Component, AfterViewInit, HostListener } from '@angular/core';
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
export class HeaderComponent implements AfterViewInit {
    business: Business;
    student: Student;
    showBurgerMenu: boolean;
    showMenu: boolean = false;
    isAdmin: boolean = false;

    constructor(private utilService: UtilService, private accountService: AccountService, private businessService: BusinessService, private router: Router, private studentService: StudentService) {
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
        utilService.showSidemenu.subscribe(newValue => {
            if (newValue) {
                this.showMenu = true;
            }
            else {
                this.showMenu = false;
            }
        });
    }

    ngAfterViewInit() {
        if (window.innerWidth < 768)
            setTimeout(() => {
                this.showBurgerMenu = true;
            });
        else
            setTimeout(() => {
                this.showBurgerMenu = false;
            });
    }

    getUserImage() {
        if (this.student) {
            return "https://graph.facebook.com/" + this.student.facebookId + "/picture?type=square";
        }
    }

    getBusiness() {
        this.utilService.displayLoading(true);
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.business = res;
            this.utilService.displayLoading(false);
        }, err => {
            this.utilService.displayLoading(false);
            if (err.status !== 401)
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
        });
    }

    logout() {
        this.utilService.displayLoading(true);
        this.accountService.logout().subscribe((response) => {
            this.utilService.displayLoading(false);
            this.router.navigate(['/']);
            this.accountService.updateToken();
            this.isAdmin = false;
        }, err => {
            this.utilService.displayLoading(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
        });
    }

    acceptTerms() {
        this.utilService.displayLoading(true);
        this.studentService.acceptTerms().subscribe(res => {
            if (res.id) {
                this.studentService.getStudentFromUser().subscribe(res => {
                    console.log(res);
                    this.student = res;
                    this.utilService.displayLoading(false);
                });
            } else {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Kunne ikke finde brugeren" });
            }
        }, err => {
            this.utilService.displayLoading(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der gik noget galt" });
            })
    }

    toggleSideMenu() {
        this.showMenu = this.showMenu === false ? true : false;
        this.utilService.displaySideMenu(this.showMenu);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        event.target.innerWidth;
        if (event.target.innerWidth < 768) {
            this.showBurgerMenu = true;
        } else {
            this.showBurgerMenu = false;
        }
    }
}
