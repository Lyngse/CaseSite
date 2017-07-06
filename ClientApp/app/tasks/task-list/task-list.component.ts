import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../../model/task';

@Component({
    selector: 'task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
    @Input() showEdit: boolean;
    @Input() tasks: Task[];
    @Output() deleteTask = new EventEmitter();
    @Output() editTask = new EventEmitter();
    constructor(private router: Router) {
    }

    taskClick(id) {
        this.router.navigate(['business/createedittask/' + id]);
    }
    
}
