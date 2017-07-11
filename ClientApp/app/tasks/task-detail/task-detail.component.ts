import { Component, AfterViewInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Business } from '../../model/business';
import { Task } from '../../model/task';
import { BusinessService } from '../../services/business.service';
import { TaskService } from '../../services/task.service';
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

    constructor(
        private businessService: BusinessService,
        private taskService: TaskService,
        private route: ActivatedRoute
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
                this.taskService.getTask(id).subscribe(res => {
                    this.task = res;
                    console.log(res);
                    this.businessService.getBusinessFromId(res.businessId).subscribe(res => this.business = res);
                });
            }
        });
    }

    getDeadlineString() {
        if (this.task) {
            return this.task.deadline.format('HH:mm - DD/MM-YYYY');
        }
    }
}
