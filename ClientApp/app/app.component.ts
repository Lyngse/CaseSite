import { Component, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    constructor() {
        moment.locale('da');
    }

}
