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
import { Business } from '../model/business';
import { BusinessService } from '../services/business.service';

@Component({
    selector: 'business-register',
    templateUrl: './business-register.component.html',
    styleUrls: ['./business-register.component.css'],
})
export class BuisnessRegisterComponent {
    isAccepted: boolean = false;
    constructor(private businessService: BusinessService) {

    }

    model: Business = new Business();
    @ViewChild('f') form: any;

    onSubmit() {
        if (this.form.valid) {

            this.businessService.createBusiness(this.model);
        }
    }

}

