import { Component, ViewEncapsulation } from '@angular/core';
import { UtilService } from './services/util.service';
import * as moment from 'moment';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    alerts = [];

    constructor(private utilService: UtilService) {
        moment.locale('da');
        utilService.alert.subscribe(newValue => {
            console.log(newValue);
            if (newValue.message && newValue.titel && newValue.type) {
                this.alerts.push(newValue);
            }
            
        });
    }

    onDeactivate() {
        document.body.scrollTop = 0;
    }

}
