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
    Injector,
    AfterViewInit
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { UtilService } from './services/util.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { AppInsightsService } from '@markpieszak/ng-application-insights';
import { TransferState } from '../modules/transfer-state/transfer-state';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import * as jQuery from 'jquery';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
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
export class AppComponent implements OnInit, AfterViewInit {
    loading: boolean;
    alerts = [];
    private appInsightsService: AppInsightsService;
    public isBrowser: boolean;
    acceptCookie = false;
    menuState: string = 'out';
    showMenu: boolean = false;

    constructor( @Inject(PLATFORM_ID) private platformId, private utilService: UtilService, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics, private metaService: Meta,
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

        this.metaService.addTags([
            { property: "og:image", content: "http://i.imgur.com/Cxl1Ii0.png" },
            { name: "image", content: "http://i.imgur.com/Cxl1Ii0.png" },
            { property: "og:description", content: "Unifacto bringer studerende og virksomheder t�ttere p� hinanden" },
            { name: "description", content: "Unifacto bringer studerende og virksomheder t�ttere p� hinanden" },
            { property: "og:title", content: "Unifacto" },
            { name: "title", content: "Unifacto" },
            { property: "og:url", content: "https://www.unifacto.com/" },
            { property: "og:type", content: "website" },
            { property: "fb:app_id", content: "113893632577611" },
            { name: "twitter:title", content: "Unifacto" },
            { name: "twitter:description", content: "Unifacto bringer studerende og virksomheder t�ttere p� hinanden" },
            { name: "twitter:image", content: "http://i.imgur.com/Cxl1Ii0.png" }
        ]);

    }

    ngOnInit() {
        this.cache.set('cached', true);
        if (this.isBrowser) {
            this.appInsightsService = <AppInsightsService>this.injector.get(AppInsightsService);
            
            this.router.events.subscribe((evt) => {
                if (!(evt instanceof NavigationEnd)) {
                    return;
                }
                window.scrollTo(0, 0);
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
    }

    ngAfterViewInit() {
        setTimeout(() => {
            jQuery(".server-loading-background").remove();
            jQuery(".spinner").remove();
        }, 500);
            window.scrollTo(0, 0);
        };


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
