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
import { UtilService } from '../../services/util.service';
import { Business } from '../../model/business';

@Component({
    selector: 'business-edit',
    templateUrl: './business-edit.component.html',
    styleUrls: ['./business-edit.component.css']
})
export class BusinessEditComponent implements AfterViewInit {
    model: Business = new Business();
    @ViewChild('f') form: any;

    constructor(private businessService: BusinessService, private utilService: UtilService) {

    }

    ngAfterViewInit() {
        this.utilService.loading.next(true);
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.model = res;
            this.utilService.loading.next(false);
        }, err => {
            this.utilService.loading.next(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" })
        });
    }

    fileChange(event) {
        debugger;
        let fileList: FileList = event.target.files;
        console.log(fileList);
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            console.log(file);
        }
    }

    onSubmit() {
        if (this.form.valid) {
            this.utilService.loading.next(true);
            this.businessService.updateBusiness(this.model).subscribe(res => {
                console.log(res);
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "success", titel: "Success", message: "Oplysninger blev ændret" });
            }, err => {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fail", message: "Oplysninger blev ikke ændret" });
            });
        }
    }
    
}
