import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { AccountService } from '../../services/account.service';
import { SolutionService } from '../../services/solution.service';
import { TaskService } from '../../services/task.service';
import { UtilService } from '../../services/util.service';
import { Business } from '../../model/business';
import { Solution } from '../../model/solution';
import { Task } from '../../model/task';
import * as moment from 'moment';

@Component({
    selector: 'business-task-solutions',
    templateUrl: './business-task-solutions.component.html',
    styleUrls: ['./business-task-solutions.component.css']
})

export class BusinessTaskSolutionsComponent implements AfterViewInit {
    business: Business;
    task: Task;
    solutions: Solution[] = [];

    constructor(private businessService: BusinessService,
        private route: ActivatedRoute,
        private accountService: AccountService,
        private solutionService: SolutionService,
        private taskService: TaskService,
        private utilService: UtilService,
        private router: Router) {
        accountService.loggedIn.subscribe(newValue => {
            if (newValue)
                this.getBusiness();
            else
                this.business = null;
        });
    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.utilService.loading.next(true);
                this.taskService.getTask(id).subscribe(res => {
                    this.utilService.loading.next(false);
                    this.task = res;
                    this.solutionService.getTaskSolutions(id).subscribe(data => {
                        this.utilService.loading.next(false);
                        this.solutions = data;
                    });
                });
            }
        });
    }

    getBusiness() {
        this.utilService.loading.next(true);
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.business = res;
            this.utilService.loading.next(false);
        }, err => {
            this.utilService.loading.next(false);
            if (err.status === 401) {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Du skal være logget ind for at se dette indhold" });
                this.router.navigateByUrl("login");
            } else {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
            }

        });
    }

    getDeadlineString() {
        if (this.task) {
            return this.task.deadline.format('HH:mm - DD/MM-YYYY');
        }
    }
}