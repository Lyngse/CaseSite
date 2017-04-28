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
import { BusinessRegistration } from '../model/business-registration';

@Component({
    selector: 'business-register',
    templateUrl: './business-register.component.html',
    styleUrls: ['./business-register.component.css'],
})
export class BuisnessRegisterComponent {

    constructor() {

    }

    model: BusinessRegistration = new BusinessRegistration();
    @ViewChild('f') form: any;

    onSubmit() {
        if (this.form.valid) {
            console.log("Form submitted!");
            this.form.reset();
            //post business og navigate til business manager
        }
    }

}

