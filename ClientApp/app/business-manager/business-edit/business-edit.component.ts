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
import { AccountService } from '../../services/account.service';
import { Business } from '../../model/business';
import { BlobService } from '../../services/blob.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'business-edit',
    templateUrl: './business-edit.component.html',
    styleUrls: ['./business-edit.component.css']
})
export class BusinessEditComponent implements AfterViewInit {
    model: Business = new Business();
    business: Business;
    @ViewChild('f') form: any;
    logoChanged: boolean = false;
    formData: FormData = new FormData();
    filePreviewPath: SafeUrl;
    isAdmin: boolean = false;

    constructor(private businessService: BusinessService,
        private utilService: UtilService,
        private blobService: BlobService,
        private accountService: AccountService,
        private router: Router,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer) {
        accountService.loggedIn.subscribe(newValue => {
            if (newValue === "business") {
                this.getBusiness();
            }
            else if (newValue === "student") {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Du har ikke tilladelse til at se dette indhold" });
                this.router.navigate(['/frontpage']);
            }
            else if (newValue === "admin") {
                this.isAdmin = true;
                this.business = null;
            }
            else {
                this.business = null;
            }
        });
    }

    getBusiness() {
        this.utilService.loading.next(true);
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.business = res;
            this.model.address = res.address;
            this.model.city = res.city;
            this.model.zip = res.zip;
            this.utilService.loading.next(false);
        }, err => {
            this.utilService.loading.next(false);
            if (err.status === 401) {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Du skal være logget ind for at se dette indhold" });
                this.router.navigateByUrl("login");
            } else {
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
            }

        });
    }

    ngAfterViewInit() {
        if (this.isAdmin) {
            this.route.params.subscribe(params => {
                let id = params['id'];
                id = parseInt(id);
                this.utilService.loading.next(true);
                this.businessService.getBusinessFromId(id).subscribe(res => {
                    console.log(res);
                    this.business = res;
                    this.model.address = res.address;
                    this.model.city = res.city;
                    this.model.zip = res.zip;
                    //this.model = this.business;
                    this.model.description = res.description;
                    this.model.email = res.email;
                    this.model.name = res.name;
                    this.model.logoUrl = res.logoUrl;
                    this.model.username = res.username;
                    this.model.userId = res.userId;
                    this.model.id = res.id;
                    this.utilService.loading.next(false);
                }, (err) => {
                    if (err.status === 401) {
                        this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Du skal være logget ind for at se dette indhold" });
                        this.router.navigateByUrl("login");
                    } else {
                        this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" });
                    }
                });
            });
        }
        else {
            this.utilService.loading.next(true);
            this.businessService.getBusinessFromUser().subscribe(res => {
                this.model = res;
                console.log(res);
                this.utilService.loading.next(false);
            }, err => {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Noget gik galt" })
            });
        }
    }

    fileChange(event) {
        this.logoChanged = true;
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.formData.append('uploadFile', file, file.name);
            this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
        }
    }

    onSubmit() {
        if (this.form.valid) {
            if (this.business.id, this.model.id) {
                this.utilService.loading.next(true);
                this.businessService.updateBusiness(this.model).subscribe(res => {
                    console.log(res);
                    if (this.logoChanged) {
                        this.blobService.uploadLogo(this.formData, this.model.id).subscribe(res => {
                            this.utilService.loading.next(false);
                            if (res.ok == true) {
                                this.utilService.loading.next(false);
                                this.utilService.alert.next({ type: "success", titel: "Success", message: "Oplysninger blev ændret" });
                                if (!this.isAdmin) {
                                    this.router.navigate(['/business']);
                                } else {
                                    this.router.navigate(['/admin']);
                                }
                            }
                        }, err => {
                            this.utilService.loading.next(false);
                            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved upload af logo" });
                        });
                    } else {
                        this.utilService.loading.next(false);
                        this.utilService.alert.next({ type: "success", titel: "Success", message: "Oplysninger blev ændret" });
                        if (!this.isAdmin) {
                            this.router.navigate(['/business']);
                        } else {
                            this.router.navigate(['/admin']);
                        }
                    }
                }, err => {
                    this.utilService.loading.next(false);
                    this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Oplysninger blev ikke ændret" });
                });
            }   
        }
    }
    
}
