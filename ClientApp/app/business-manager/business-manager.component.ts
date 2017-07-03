import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../services/business.service';
import { AccountService } from '../services/account.service';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { Task } from '../model/task';

@Component({
    selector: 'business-manager',
    templateUrl: './business-manager.component.html',
    styleUrls: ['./business-manager.component.css']
})
export class BusinessManagerComponent{
    loading: boolean = false;
    tasks: Task[];

    constructor(private businessService: BusinessService,
        private accountService: AccountService,
        private taskService: TaskService,
        private router: Router) {

    }

    getInfo() {
        this.businessService.getBusinessFromUser()
            .subscribe((response) => {
                console.log(response);
        }, (err) => console.log(err));
    }

    ngAfterViewInit() {
        this.loading = true;
        this.taskService.getTasksForBusiness().subscribe((data) => {
            console.log(data);
            this.tasks = data;
            this.loading = false;
        }, (err) => {
            this.loading = false;
            if (err.status === 401)
                this.router.navigateByUrl("login");
            else
                console.log(err);
        });
    }

    handleDeleteTask(id) {
        this.loading = true;
        this.taskService.deleteTask(id).subscribe((data) => {
            let index = this.tasks.findIndex(task => {
                return task.id === id;
            });
            if (index > -1)
                this.tasks.splice(index, 1);
            this.loading = false;
        })       
    }

    handleEditTask(id) {
        this.router.navigateByUrl("business/createedittask/" + id);
    }

}
