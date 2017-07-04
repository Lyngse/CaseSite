﻿import { Component, AfterViewInit } from '@angular/core';
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
export class TaskDetailComponent implements AfterViewInit {
    task: Task;
    business: Business;

    constructor(
        private businessService: BusinessService,
        private taskService: TaskService,
        private route: ActivatedRoute
    ) {

    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];
            this.taskService.getTask(id).subscribe(res => {
                console.log(res);
                this.task = res;
                this.businessService.getBusinessFromId(res.businessId).subscribe(res => this.business = res);
            });

        })   
    }

    getDeadlineString() {
        if (this.task) {
            return this.task.deadline.format('HH:mm - DD/MM-YYYY');
        }
    }
}