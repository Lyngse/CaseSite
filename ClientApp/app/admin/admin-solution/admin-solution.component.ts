import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AccountService } from '../../services/account.service';
import { UtilService } from '../../services/util.service';
import { Solution } from '../../model/solution';

@Component({
    selector: 'admin-solution',
    templateUrl: './admin-solution.component.html',
    styleUrls: ['./admin-solution.component.css']
})
export class AdminSolutionComponent implements AfterViewInit {
    query: string;
    solutions: Solution[];

    constructor(private adminService: AdminService, private accountService: AccountService, private utilService: UtilService, private router: Router) {

    }

    ngAfterViewInit() {

    }


    search() {
        this.utilService.loading.next(true);
        if (!this.query) {
            this.adminService.getAllSolutions().subscribe(res => {
                this.solutions = res;
                console.log(res);
                this.utilService.loading.next(false);
            }, (err) => {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved hentningen af løsningsforslagene" });
            });
        } else {
            this.adminService.searchSolution(this.query).subscribe(res => {
                this.solutions = res;
                console.log(res);
                this.utilService.loading.next(false);
            }, (err) => {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved hentningen af løsningsforslagene" });
            });
        }
    }

    gotoSolution(studentId: number, taskId: number) {

    }

}
