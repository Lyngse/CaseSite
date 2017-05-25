import {
    Component,
    AfterViewInit,
    Pipe,
    ViewChild
} from '@angular/core';
import {
    FormControl,
    FormGroup,
} from '@angular/forms';
import { BusinessService } from '../../services/business.service';
import { Business } from '../../model/business';

@Component({
    selector: 'business-edit',
    templateUrl: './business-edit.component.html',
    styleUrls: ['./business-edit.component.css']
})
export class BusinessEditComponent implements AfterViewInit {
    loading: boolean = false;
    model: Business = new Business();
    @ViewChild('f') form: any;

    constructor(private businessService: BusinessService) {

    }

    ngAfterViewInit() {
        this.loading = true;
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.model = res;
            this.loading = false;
        });
    }

    onSubmit() {
        
        if (this.form.valid) {
            this.loading = true;
            this.businessService.updateBusiness(this.model).subscribe(res => {
                console.log(res);
                this.loading = false;
            });
        }
    }
    
}
