import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { StudentService } from '../../services/student.service';
import { UtilService } from '../../services/util.service';
import { Student } from '../../model/student';
import * as moment from 'moment';

@Component({
    selector: 'student-settings',
    templateUrl: './student-settings.component.html',
    styleUrls: ['./student-settings.component.css']
})
export class StudentSettingsComponent implements AfterViewInit {
    @ViewChild('f') form: any;
    model: Student = new Student();

    constructor(private router: Router, private studentService: StudentService, private accountService: AccountService, private utilService: UtilService) {
        this.accountService.loggedIn.subscribe(newValue => {
            if (newValue === "student")
                this.studentService.getStudentFromUser().subscribe(res => {
                    console.log(res);
                    this.model = res;
                });
        });
    }

    ngAfterViewInit() {

    }

    updateStudent() {
        if (this.form.valid && this.model.id) {
            this.utilService.loading.next(true);
            this.studentService.updateStudent(this.model).subscribe(res => {
                if (res.id) {
                    this.utilService.loading.next(false);
                    this.utilService.alert.next({ type: "success", titel: "Success", message: "Oplysninger blev ændret" });
                    this.router.navigate(['/student']);
                }
            }, err => {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Oplysninger blev ikke ændret" });
            });
        }
    }
}
