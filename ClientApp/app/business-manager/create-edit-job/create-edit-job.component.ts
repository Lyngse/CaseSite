import { Component, OnInit, Pipe, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Job } from '../../model/job';
import * as moment from 'moment';

import { JobService } from '../../services/job.service'

@Component({
    selector: 'create-edit-job',
    templateUrl: './create-edit-job.component.html',
    styleUrls: ['./create-edit-job.component.css']
})
export class CreateEditJobComponent implements AfterViewInit {
    jobTypes: string[] = [
        'Grafisk Opgave',
        'Video Opgave',
        'Event Opgave',
        'Strategisk Opgave',
        'Målgruppeanalyse',
        'Dataanalyse'
    ];
    edit: Boolean;
    loading: Boolean = false;

    model: Job = new Job();

    constructor(private jobService: JobService, private route: ActivatedRoute) {
    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.jobService.getJob(id).subscribe(res => {
                    console.log(res);
                    this.model = res;
                    this.edit = true;
                });
            } else {
                this.edit = false;
            }

        }) 

    }

    @ViewChild('f') form: any;

    onSubmit() {
        if (this.form.valid) {
            this.loading = true;
            if (!this.model.id) {
                
                this.jobService.createJob(this.model).subscribe((data) => {
                    console.log(data);
                    this.loading = false;
                }, (err) => {
                    this.loading = false;
                });
                //this.businessService.createBusiness(this.model);
            } else {
                this.jobService.updateJob(this.model).subscribe((data) => {
                    console.log(data);
                    this.loading = false;
                }, (err) => {
                    this.loading = false;
                });
            }  
        }
    }

    deadlineChanged(newValue) {
        this.model.deadline = moment(newValue);
        console.log(this.model.deadline.format());
    }
}
