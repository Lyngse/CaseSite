import { Component, AfterViewInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Business } from '../../model/business';
import { Task } from '../../model/task';
import { BusinessService } from '../../services/business.service';
import { TaskService } from '../../services/task.service';
import { BlobService } from '../../services/blob.service';
import { UtilService } from '../../services/util.service';
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

    constructor(
        private businessService: BusinessService,
        private taskService: TaskService,
        private route: ActivatedRoute,
        private utilService: UtilService,
        private blobService: BlobService
    ) {

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
}
