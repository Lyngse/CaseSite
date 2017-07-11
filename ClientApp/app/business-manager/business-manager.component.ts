import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../services/business.service';
import { AccountService } from '../services/account.service';
import { TaskService } from '../services/task.service';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';
import { Task } from '../model/task';

@Component({
    selector: 'business-manager',
    templateUrl: './business-manager.component.html',
    styleUrls: ['./business-manager.component.css']
})
export class BusinessManagerComponent{
    tasks: Task[];

    constructor(private businessService: BusinessService,
        private accountService: AccountService,
        private taskService: TaskService,
        private utilService: UtilService,
        private router: Router) {

    }

    getInfo() {
        this.businessService.getBusinessFromUser()
            .subscribe((response) => {
        }, (err) => console.log(err));
    }

    ngAfterViewInit() {
        this.utilService.loading.next(true);
        this.taskService.getTasksForBusiness().subscribe((data) => {
            this.utilService.loading.next(false);
            this.tasks = data;
            this.tasks.reverse();
        }, (err) => {
            this.utilService.loading.next(false);

            if (err.status === 401) {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Du skal være logget ind for at se dette indhold" });
                this.router.navigateByUrl("login");
            } else {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
            }
        });
    }

    handleEditTask(id) {
        this.router.navigateByUrl("business/createedittask/" + id);
    }

}
