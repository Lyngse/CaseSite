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
    loading = false;
    alerts = [];

    constructor(private utilService: UtilService) {
        moment.locale('da');
        utilService.alert.subscribe(newValue => {
            if (newValue.titel && newValue.type) {
                this.alerts.push(newValue);
            }
        });
        utilService.loading.subscribe(newValue => {
            if (newValue)
                this.loading = true;
            else
                this.loading = false;
        });
    }

    onDeactivate() {
        document.body.scrollTop = 0;
    }

}
