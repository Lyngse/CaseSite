import { Component, AfterViewInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../model/task';

@Component({
    selector: 'frontpage',
    templateUrl: './frontpage.component.html',
    styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements AfterViewInit {
    latestTasks: Task[];

    constructor(private taskService: TaskService) {

    }

    ngAfterViewInit() {
        this.taskService.getLatestTasks().subscribe(res => {
            console.log(res);
            this.latestTasks = res;
        })
    }

}
