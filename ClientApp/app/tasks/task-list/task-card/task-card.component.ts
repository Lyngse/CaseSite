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

    constructor() {
    }

    getDeadlineString() {
        if (this.task) {
            return this.task.deadline.fromNow();
        }
    }
}
