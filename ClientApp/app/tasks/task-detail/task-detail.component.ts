import { Component, AfterViewInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from '../../model/business';
import { Task } from '../../model/task';
import { Student } from '../../model/student';
import { BusinessService } from '../../services/business.service';
import { TaskService } from '../../services/task.service';
import { BlobService } from '../../services/blob.service';
import { UtilService } from '../../services/util.service';
import { StudentService } from '../../services/student.service';
import { AccountService } from '../../services/account.service';
import * as moment from 'moment';

@Component({
    selector: 'task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements AfterViewInit, OnChanges {
    @Input('task') inputTask: Task;
    @Input('business') inputBusiness: Business;
    task: Task;
    business: Business;
    attachments: any;
    student: Student;

    constructor(
        private businessService: BusinessService,
        private taskService: TaskService,
        private route: ActivatedRoute,
        private utilService: UtilService,
        private blobService: BlobService,
        private studentService: StudentService,
        private accountService: AccountService,
        private router: Router
    ) {
        this.accountService.loggedIn.subscribe(newValue => {
            if (newValue === "student")
                this.studentService.getStudentFromUser().subscribe(res => {
                    console.log(res);
                    this.student = res;
                });
        });
    }

    ngOnChanges(changes) {
        this.task = this.inputTask;
        this.business = this.inputBusiness;
    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.utilService.loading.next(true);
                this.taskService.getTask(id).subscribe(res => {
                    if (res.id) {
                        this.task = res;
                        this.businessService.getBusinessFromId(res.businessId).subscribe(res => {
                            if (res.id) {
                                this.business = res
                                this.getAttachments(id);
                            } else {
                                this.utilService.loading.next(false);
                                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl, kunne ikke finde den tilknyttede virksomhed" });
                            }                          
                        });
                    } else {
                        this.utilService.loading.next(false);
                        this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl, kunne ikke finde opgaven" });
                    }
                    
                });
            }
        });
    }

    getAttachments(id) {
        this.utilService.loading.next(true);
        this.blobService.getAttachments(id).subscribe(res => {
            this.attachments = res;
            this.attachments.forEach((f) => {
                f.fileName = this.formatFileName(f.name)
            });
            this.utilService.loading.next(false);
        }, (err) => {
            this.utilService.loading.next(false);
        });
    }

    formatFileName(filePath: string) {
        return filePath.slice(filePath.lastIndexOf('/') + 1, filePath.length);
    }

    getDeadlineString() {
        if (this.task) {
            return this.task.deadline.format('HH:mm - DD/MM-YYYY');
        }
    }

    gotoUploadSolution(taskId) {
        this.router.navigate(['/student/uploadsolution/' + taskId]);
    }
}
