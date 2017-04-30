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
import { BusinessService } from '../../services/business.service';
import { Business } from '../../model/business';

@Component({
    selector: 'business-edit',
    templateUrl: './business-edit.component.html',
    styleUrls: ['./business-edit.component.css']
})
export class BusinessEditComponent {
    constructor(private businessService: BusinessService) {

    }

    model: Business = new Business();
    @ViewChild('f') form: any;
}
