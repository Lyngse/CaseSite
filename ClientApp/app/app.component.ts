import {
    Component,
    ViewEncapsulation,
    trigger,
    state,
    style,
    animate,
    transition,
    PLATFORM_ID,
    Inject,
    OnInit,
    Injector
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common'
import { Router } from '@angular/router'
import { UtilService } from './services/util.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { AppInsightsService } from 'ng2-appinsights';
import { TransferState } from '../modules/transfer-state/transfer-state';
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
        ]),
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ])
    ]
})
export class AppComponent implements OnInit {
    loading: boolean;
    alerts = [];
    private appInsightsService: AppInsightsService;
    private isBrowser: boolean;
    acceptCookie = false;
    menuState: string = 'out';
    showMenu: boolean = false;

    constructor( @Inject(PLATFORM_ID) private platformId, private utilService: UtilService, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
            private injector: Injector, private cache: TransferState, private router: Router) {
        this.isBrowser = isPlatformBrowser(platformId);
        moment.locale('da');
        utilService.alert.subscribe(newValue => {
            if (newValue.titel && newValue.type) {
                this.alerts.push(newValue);
                this.removeAlert(newValue);
                if (this.isBrowser) {
                    this.appInsightsService.trackEvent(newValue.type, { "titel": newValue.titel, "message": newValue.message });
                }
            }
        });
        utilService.loading.subscribe(newValue => {
            if (newValue)
                this.loading = true;
            else
                this.loading = false;
        });
        if (this.isBrowser) {
            if (localStorage.getItem("AcceptCookies") != "accept") {
                this.acceptCookie = false;
            } else {
                this.acceptCookie = true;
            }
        }
    }

    ngOnInit() {
        this.cache.set('cached', true);
        if (this.isBrowser) {
            this.appInsightsService = <AppInsightsService>this.injector.get(AppInsightsService);
            this.appInsightsService.Init({
                instrumentationKey: '7b0358cc-cf4c-4c1b-9b6c-658e45bf66df'
            });
        }

        this.utilService.showSidemenu.subscribe(newValue => {
            if (newValue) {
                this.menuState = 'in';
                this.showMenu = true;
            }
            else {
                this.menuState = 'out';
                this.showMenu = false;
            }
        });

        this.appInsightsService.Init({
            instrumentationKey: '7b0358cc-cf4c-4c1b-9b6c-658e45bf66df'
        });
    }

    setCookie() {
        let value: string = "accept";
        let key: string = "AcceptCookies";
        this.acceptCookie = true;
        try {
            localStorage.setItem(key, value);
        }
        catch (e) {

        }
    }

    onDeactivate() {
        document.body.scrollTop = 0;
    }

    toggleSideMenu() {
        this.menuState = this.menuState === 'out' ? 'in' : 'out';
    }

    closeSideMenu() {
        this.showMenu = !this.showMenu;
        this.utilService.displaySideMenu(this.showMenu);
    }

    removeAlert(alert) {
        setTimeout(() => {
            let index = this.alerts.indexOf(alert);
            this.alerts.splice(index, 1);
        }, 5000)
    }
}
