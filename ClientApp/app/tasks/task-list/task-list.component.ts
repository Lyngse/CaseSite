import { Component, Input, Output, EventEmitter } from '@angular/core';
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
    constructor() {
    }

    handleDeleteTask(id) {
        this.deleteTask.emit(id);
    }

    handleEditTask(id) {
        this.editTask.emit(id);
    }

    
}
