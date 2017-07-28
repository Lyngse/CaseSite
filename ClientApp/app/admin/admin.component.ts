import { Component, AfterViewInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements AfterViewInit {
    businessCount: number = 0;
    studentCount: number = 0;
    taskCount: number = 0;
    solutionCount: number = 0;

    constructor(private adminService: AdminService) {

    }

    ngAfterViewInit() {
        this.adminService.getCounts().subscribe(res => {
            console.log(res);
            this.businessCount = res[0];
            this.studentCount = res[1];
            this.taskCount = res[2];
            this.solutionCount = res[3];
        });
    }
}
