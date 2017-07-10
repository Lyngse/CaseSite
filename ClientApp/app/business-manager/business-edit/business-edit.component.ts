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
import { BlobService } from '../../services/blob.service';
import { Router } from '@angular/router';

@Component({
    selector: 'business-edit',
    templateUrl: './business-edit.component.html',
    styleUrls: ['./business-edit.component.css']
})
export class BusinessEditComponent implements AfterViewInit {
    model: Business = new Business();
    @ViewChild('f') form: any;
    logoChanged: boolean = false;
    formData: FormData = new FormData();

    constructor(private businessService: BusinessService, private utilService: UtilService, private blobService: BlobService, private router: Router) {

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
        this.logoChanged = true;
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.formData.append('uploadFile', file, file.name);
        }
    }

    onSubmit() {
        if (this.form.valid) {
            this.utilService.loading.next(true);
            this.businessService.updateBusiness(this.model).subscribe(res => {
                console.log(res);
                this.blobService.uploadLogo(this.formData, this.model.id).subscribe(res => {
                    console.log(res);
                    this.utilService.loading.next(false);          
                    if (res.ok == true) {
                        this.router.navigate(['/business']);
                        this.utilService.alert.next({ type: "success", titel: "Success", message: "Oplysninger blev ændret" });
                    }
                }, err => {
                    this.utilService.loading.next(false);
                    this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved upload af logo" });
                });
            }, err => {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Oplysninger blev ikke ændret" });
                });
            
        }
    }
    
}
