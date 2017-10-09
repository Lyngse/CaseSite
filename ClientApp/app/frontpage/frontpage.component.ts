import { Component, AfterViewInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { UtilService } from '../services/util.service';
import { Task } from '../model/task';

@Component({
    selector: 'frontpage',
    templateUrl: './frontpage.component.html',
    styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements AfterViewInit {
    latestTasks: Task[];

    constructor(private taskService: TaskService, private utilService: UtilService) {

    }

    ngAfterViewInit() {
        this.utilService.displayLoading(true);
        this.taskService.getLatestTasks().subscribe(res => {
            this.utilService.displayLoading(false);
            this.latestTasks = res;
        }, err => {
            this.utilService.displayLoading(false);
            //this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Kunne ikke hente nyeste opgaver" });
        })
    }

}
