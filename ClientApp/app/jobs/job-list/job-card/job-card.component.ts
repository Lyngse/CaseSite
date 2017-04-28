import { Component, Input } from '@angular/core';

@Component({
    selector: 'job-card',
    templateUrl: './job-card.component.html',
    styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
    @Input() showEdit: boolean;

    constructor() {

    }

}
