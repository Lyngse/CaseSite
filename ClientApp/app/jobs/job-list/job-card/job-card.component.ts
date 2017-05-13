import { Component, Input} from '@angular/core';
import { Job } from '../../../model/job';
import * as moment from 'moment';

@Component({
    selector: 'job-card',
    templateUrl: './job-card.component.html',
    styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
    @Input() showEdit: boolean;
    @Input() job: Job;

    constructor() {
    }

    getDeadlineString() {
        if (this.job) {
            return this.job.deadline.fromNow();
        }
    }
}
