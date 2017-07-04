import { Component,OnInit } from '@angular/core';
import { Task } from '../model/task';
import { TaskService } from '../services/task.service'
import * as moment from 'moment';

@Component({
    selector: 'tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
    tasks: Task[];
    tasksToShow: Task[];
    sortingString: string;
    loading: boolean = false;

    constructor(private taskService: TaskService) {

    }

    ngOnInit() {
        this.loading = true;
        this.taskService.getAllTasks().subscribe((data) => {
            console.log(data);
            this.tasks = data.sort((t1, t2) => { return t1.deadline.diff(t2.deadline) });
            this.tasksToShow = this.tasks;
            this.loading = false;
        }, (err) => {
            console.log(err);
            this.loading = false;
        });
    }

    sort(sortString: string) {
        this.sortingString = sortString;
        switch (sortString) {
            case 'deadline':
                this.tasksToShow = this.tasksToShow.sort((t1, t2) => { return t1.deadline.diff(t2.deadline); });
                break;
            case 'alphabetically':
                this.tasksToShow = this.tasksToShow.sort((t1, t2) => {
                    if (t1.title > t2.title) return 1;
                    if (t1.title < t2.title) return -1;
                    return 0;
                });
                break;
            default:
                this.tasksToShow = this.tasksToShow.sort((t1, t2) => { return t1.deadline.diff(t2.deadline) });
                break;
        }
        
    }

    filterByType(type: string) {
        console.log(type);
        this.tasksToShow = this.tasks.filter(t => { return t.type === type; });
        this.sort(this.sortingString);
    }

}
