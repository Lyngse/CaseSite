import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Task } from '../../../model/task';
import * as moment from 'moment';

@Component({
    selector: 'task-card',
    templateUrl: './task-card.component.html',
    styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
    @Input() showEdit: boolean;
    @Input() task: Task;
    @Output() deleteTask = new EventEmitter();
    @Output() editTask = new EventEmitter();

    constructor() {
    }

    getDeadlineString() {
        if (this.task) {
            return this.task.deadline.fromNow();
        }
    }

    deleteTaskClick() {
        this.deleteTask.emit(this.task.id);
    }

    editTaskClick() {
        this.editTask.emit(this.task.id);
    }
}
