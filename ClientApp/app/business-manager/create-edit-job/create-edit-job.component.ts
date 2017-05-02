import { Component, OnInit, Pipe, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Job } from '../../model/job';

import { JobService } from '../../services/job.service'

@Component({
    selector: 'create-edit-job',
    templateUrl: './create-edit-job.component.html',
    styleUrls: ['./create-edit-job.component.css']
})
export class CreateEditJobComponent {
    jobTypes: string[] = [
        'Grafisk Opgave',
        'Video Opgave',
        'Event Opgave',
        'Strategisk Opgave',
        'Målgruppeanalyse',
        'Dataanalyse'
    ];

    model: Job = new Job();

    constructor(private jobService: JobService) {
    }

    @ViewChild('f') form: any;

    onSubmit() {
        if (this.form.valid) {

            this.jobService.createJob(this.model)
            //this.businessService.createBusiness(this.model);
        }
    }
}
