import { Component,OnInit } from '@angular/core';
import { Task } from '../model/task';
import { TaskService } from '../services/task.service'

@Component({
    selector: 'tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
    tasks: Task[]
    loading: boolean = false;

    constructor(private taskService: TaskService) {

    }

    ngOnInit() {
        this.loading = true;
        this.taskService.getAllTasks().subscribe((data) => {
            console.log(data);
            this.tasks = data;
            this.loading = false;
        }, (err) => {
            console.log(err);
            this.loading = false;
        });
    }

}
