import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Task } from '../../../model/job';
import * as moment from 'moment';

@Component({
    selector: 'job-card',
    templateUrl: './job-card.component.html',
    styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
    @Input() showEdit: boolean;
    @Input() job: Task;
    @Output() deleteJob = new EventEmitter();
    @Output() editJob = new EventEmitter();

    constructor() {
    }

    getDeadlineString() {
        if (this.job) {
            return this.job.deadline.fromNow();
        }
    }

    deleteJobClick() {
        this.deleteJob.emit(this.job.id);
    }

    editJobClick() {
        this.editJob.emit(this.job.id);
    }
}
