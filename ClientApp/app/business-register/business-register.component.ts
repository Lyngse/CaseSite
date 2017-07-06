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
import { Router } from '@angular/router';
import { Business } from '../model/business';
import { BusinessService } from '../services/business.service';
import { AccountService } from '../services/account.service';
import { UtilService } from '../services/util.service';

@Component({
    selector: 'business-register',
    templateUrl: './business-register.component.html',
    styleUrls: ['./business-register.component.css'],
})
export class BuisnessRegisterComponent {
    isAccepted: boolean = false;
    loading = false;
    loginFailedMsg: string = "";
    constructor(private utilService: UtilService, private businessService: BusinessService, private accountService: AccountService, private router: Router) {

    }

    model: Business = new Business();
    @ViewChild('f') form: any;

    onSubmit() {
        if (this.form.valid) {
            this.utilService.loading.next(true);
            this.accountService.registerUser(this.model.username, this.model.password, this.model.email).subscribe((response) => {
                
                if (response.ok) {
                    let userId = response._body;
                    this.businessService.createBusiness(this.model, userId).subscribe((response) => {
                        this.utilService.loading.next(false);
                        if (response.id) {
                            this.utilService.alert.next({ type: "success", titel: "Success", message: "Oprettelse lykkedes" });
                            this.router.navigate(['/login']);
                        }
                    }, err => {
                        //slet user!
                        this.utilService.loading.next(false);
                        this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Oprettelse mislykkedes" });
                    });
                } else {
                    this.utilService.loading.next(false);
                    this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Oprettelse mislykkedes" });
                }
            }, err => {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Oprettelse mislykkedes" });
            });
        }
    }

}

