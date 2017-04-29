import { Component } from '@angular/core';
import { BusinessService } from '../services/business.service';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'business-manager',
    templateUrl: './business-manager.component.html',
    styleUrls: ['./business-manager.component.css']
})
export class BusinessManagerComponent{
    constructor(private businessService: BusinessService, private accountService: AccountService) {

    }
    getInfo() {
        this.businessService.getBusinessInfo().then((response) => { console.log(response) });
    }

    logout() {
        this.accountService.logout().then((response) => { console.log(response) });
    }

}
