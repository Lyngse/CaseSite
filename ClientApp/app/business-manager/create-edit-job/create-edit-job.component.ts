import {
    Component,
    OnInit,
    Pipe,
    ViewChild
} from '@angular/core';
import {
    FormControl,
    FormGroup,
} from '@angular/forms';
import { Job } from '../../model/job';

@Component({
    selector: 'create-edit-job',
    templateUrl: './create-edit-job.component.html',
    styleUrls: ['./create-edit-job.component.css']
})
export class CreateEditJobComponent {
    constructor() {
    }

    model: Job = new Job();
    @ViewChild('f') form: any;

    onSubmit() {
        if (this.form.valid) {

            //this.businessService.createBusiness(this.model);
        }
    }
}
