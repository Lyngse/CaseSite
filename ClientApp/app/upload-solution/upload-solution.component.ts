import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { StudentService } from '../services/student.service';
import { UtilService } from '../services/util.service';
import { Student } from '../model/student';

@Component({
    selector: 'upload-solution',
    templateUrl: './upload-solution.component.html',
    styleUrls: ['./upload-solution.component.css']
})
export class UploadSolutionComponent implements AfterViewInit {
    student: Student;

    constructor(private router: Router, private studentService: StudentService, private accountService: AccountService, private utilService: UtilService) {
        this.accountService.loggedIn.subscribe(newValue => {
            if (newValue === "student")
                this.studentService.getStudentFromUser().subscribe(res => {
                    console.log(res);
                    this.student = res;
                });
        });
    }

    ngAfterViewInit() {
    }


}