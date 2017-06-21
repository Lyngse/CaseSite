import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../model/job';

@Component({
    selector: 'job-list',
    templateUrl: './job-list.component.html',
    styleUrls: ['./job-list.component.css']
})
export class JobListComponent {
    @Input() showEdit: boolean;
    @Input() jobs: Task[];
    @Output() deleteJob = new EventEmitter();
    @Output() editJob = new EventEmitter();
    constructor() {
    }

    handleDeleteJob(id) {
        this.deleteJob.emit(id);
    }

    handleEditJob(id) {
        this.editJob.emit(id);
    }

    
}
