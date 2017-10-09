import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AccountService } from '../../services/account.service';
import { UtilService } from '../../services/util.service';
import { Student } from '../../model/student';
import { Task } from '../../model/task';

@Component({
    selector: 'admin-student',
    templateUrl: './admin-student.component.html',
    styleUrls: ['./admin-student.component.css']
})
export class AdminStudentComponent implements AfterViewInit {
    query: string;
    students: Student[];

    constructor(private adminService: AdminService, private accountService: AccountService, private utilService: UtilService, private router: Router) {

    }

    ngAfterViewInit() {

    }


    search() {
        this.utilService.displayLoading(true);
        if (!this.query) {
            this.adminService.getAllStudents().subscribe(res => {
                this.students = res;
                console.log(res);
                this.utilService.displayLoading(false);
            }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved hentningen af de studerende" });
            });
        } else {
            this.adminService.searchStudent(this.query).subscribe(res => {
                this.students = res;
                console.log(res);
                this.utilService.displayLoading(false);
            }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved hentningen af de studenrende" });
            });
        }
    }

    numberOfWins(student: Student) {
        let wins = 0;
        student.solutions.forEach(s => {
            if (s.id == s.task.winnerSolutionId) {
                wins++;
            }
        });
        return wins;
    }

}
