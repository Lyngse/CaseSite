import { Component, Input} from '@angular/core';
import { Job } from '../../../model/job';

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
}
