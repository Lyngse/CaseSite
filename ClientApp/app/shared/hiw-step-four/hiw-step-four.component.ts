import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
    selector: 'hiw-step-four',
    templateUrl: './hiw-step-four.component.html',
    styleUrls: ['./hiw-step-four.component.css']
})
export class HIWStepFourComponent implements AfterViewInit {
    @Input() number: number; 
    @Input() title: string;
    @Input() description: string;
    constructor() {

    }

    ngAfterViewInit() {

    }
}
