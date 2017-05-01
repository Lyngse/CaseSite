import { Component, Input } from '@angular/core';
import { Job } from '../../model/job';

@Component({
    selector: 'job-list',
    templateUrl: './job-list.component.html',
    styleUrls: ['./job-list.component.css']
})
export class JobListComponent {
    @Input() showEdit: boolean;
    @Input() jobs: Job[];
    constructor() {

    }
}
