import { Component, AfterViewInit } from '@angular/core';
import { BusinessService } from '../services/business.service';
import { AccountService } from '../services/account.service';
import { TaskService } from '../services/task.service';
import { UtilService } from '../services/util.service';
import { SolutionService } from '../services/solution.service';
import { Router } from '@angular/router';
import { Task } from '../model/task';
import * as moment from 'moment';

@Component({
    selector: 'business-manager',
    templateUrl: './business-manager.component.html',
    styleUrls: ['./business-manager.component.css']
})
export class BusinessManagerComponent implements AfterViewInit {
    tasks: Task[] = [];
    pastTasks: Task[] = [];

    constructor(private businessService: BusinessService,
        private accountService: AccountService,
        private taskService: TaskService,
        private utilService: UtilService,
        private router: Router,
        private solutionService: SolutionService) {

    }

    getInfo() {
        this.businessService.getBusinessFromUser()
            .subscribe((response) => {
        }, (err) => console.log(err));
    }

    ngAfterViewInit() {
        this.utilService.displayLoading(true);
        this.businessService.getBusinessWithTasks().subscribe((data) => {
            console.log(data);
            if (data.tasks.length > 0) {

                let now = moment();
                console.log(data.tasks);
                data.tasks.forEach(t => {
                    if (t.deadline.isAfter(now))
                        this.tasks.push(t);
                    else
                        this.pastTasks.push(t);
                });
            }
            this.utilService.displayLoading(false);

        }, (err) => {
            this.utilService.displayLoading(false);

            if (err.status === 401) {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Du skal være logget ind for at se dette indhold" });
                this.router.navigateByUrl("login");
            } else {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
            }
        });
    }    

    handleEditTask(id) {
        this.router.navigateByUrl("business/create-edit-task/" + id);
    }

    gotoTaskDetail(taskId) {
        this.router.navigate(["/tasks/detail/" + taskId]);
    }

    gotoSolutionsView(taskId) {
        this.router.navigateByUrl("business/solutions/" + taskId);
    }

    gotoWinnerSolutionDownload(winnerSolutionId: number) {
        this.solutionService.getSolution(winnerSolutionId).subscribe(res => {
            console.log(res);
            this.router.navigate(["business/solutions/" + res.taskId + "/download/" + res.studentId]);
        });
    }
}
