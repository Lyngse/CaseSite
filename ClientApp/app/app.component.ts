import {
    Component,
    ViewEncapsulation,
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/core';
import { UtilService } from './services/util.service';
import { CookieService } from 'angular2-cookie/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import * as moment from 'moment';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('flyInOut', [
            state('in', style({ transform: 'translateY(0)' })),
            transition('void => *', [
                style({ transform: 'translateY(100%)' }),
                animate(500)
            ])
        ])
    ]
})
export class AppComponent {
    loading = false;
    alerts = [];
    acceptCookie = false;

    constructor(private utilService: UtilService, private cookieService: CookieService, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
        moment.locale('da');
        utilService.alert.subscribe(newValue => {
            if (newValue.titel && newValue.type) {
                this.alerts.push(newValue);
                this.removeAlert(newValue);
            }
        });
        utilService.loading.subscribe(newValue => {
            if (newValue)
                this.loading = true;
            else
                this.loading = false;
        });
        if (this.cookieService.get("AcceptCookies") != "Accept") {
            this.acceptCookie = false;
        } else {
            this.acceptCookie = true;
        }
    }

    setCookie() {
        let value: string = "Accept";
        let key: string = "AcceptCookies";
        this.acceptCookie = true;
        this.cookieService.put(key, value);
    }

    onDeactivate() {
        document.body.scrollTop = 0;
    }

    removeAlert(alert) {
        setTimeout(() => {
            let index = this.alerts.indexOf(alert);
            this.alerts.splice(index, 1);
        }, 5000)
    }
}
