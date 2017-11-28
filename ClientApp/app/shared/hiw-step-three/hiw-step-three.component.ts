import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
    selector: 'hiw-step-three',
    templateUrl: './hiw-step-three.component.html',
    styleUrls: ['./hiw-step-three.component.css']
})
export class HIWStepThreeComponent implements AfterViewInit {
    @Input() number: number; 
    @Input() title: string;
    @Input() description: string;
    constructor() {

    }

    ngAfterViewInit() {

    }
}
