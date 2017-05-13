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
import { AccountService } from '../services/account.service';

@Component({
    selector: 'business-register',
    templateUrl: './business-register.component.html',
    styleUrls: ['./business-register.component.css'],
})
export class BuisnessRegisterComponent {
    isAccepted: boolean = false;
    constructor(private businessService: BusinessService, private accountService: AccountService) {

    }

    model: Business = new Business();
    @ViewChild('f') form: any;

    onSubmit() {
        if (this.form.valid) {
            this.accountService.registerUser(this.model.username, this.model.password, this.model.email).subscribe((response) => {
                if (response.ok) {
                    let userId = response._body;
                    this.businessService.createBusiness(this.model, userId).subscribe((response) => {
                        console.log(response);
                    })
                }
            });
            //this.businessService.createBusiness(this.model);
        }
    }

}

