import { Component } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'shared-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    constructor(private accountService: AccountService) {

    }

    logout() {
        this.accountService.logout().then((response) => { console.log(response) });
    }
}
