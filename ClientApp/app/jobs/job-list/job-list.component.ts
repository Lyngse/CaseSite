import { Component, Input } from '@angular/core';

@Component({
    selector: 'job-list',
    templateUrl: './job-list.component.html',
    styleUrls: ['./job-list.component.css']
})
export class JobListComponent {
    @Input() showEdit: boolean;
    constructor() {

    }
}
