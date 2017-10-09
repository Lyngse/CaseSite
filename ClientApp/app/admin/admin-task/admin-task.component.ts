import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AccountService } from '../../services/account.service';
import { UtilService } from '../../services/util.service';
import { Task } from '../../model/task';

@Component({
    selector: 'admin-task',
    templateUrl: './admin-task.component.html',
    styleUrls: ['./admin-task.component.css']
})
export class AdminTaskComponent implements AfterViewInit {
    query: string;
    tasks: Task[];

    constructor(private adminService: AdminService, private accountService: AccountService, private utilService: UtilService, private router: Router) {

    }

    ngAfterViewInit() {

    }


    search() {
        this.utilService.displayLoading(true);
        if (!this.query) {
            this.adminService.getAllTasks().subscribe(res => {
                console.log(res);
                this.tasks = res;
                this.utilService.displayLoading(false);
            }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved hentningen af opgaverne" });
            });
        } else {
            this.adminService.searchTask(this.query).subscribe(res => {
                console.log(res);
                this.tasks = res;
                this.utilService.displayLoading(false);
            }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved hentningen af opgaverne" });
            });
        }
    }

    gotoTaskEdit(id) {
        this.router.navigate(['business/create-edit-task/' + id]);
    }

    gotoWinnerSolutionDownload(taskId: number, studentId: number) {
        this.router.navigate(['business/solutions/' + taskId + '/download/' + studentId]);
    }

    deleteTask(task: Task) {
        this.utilService.displayLoading(true);
        
        this.adminService.deleteTask(task.id).subscribe(res => {
            if (res.ok) {
                this.utilService.alert.next({ type: "success", titel: "Succes", message: "Opgaven er blevet slettet" });
                this.query = null;
                this.search();
            } else {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved sletningen af opgaven" });
            }
        }, (err) => {
            this.utilService.displayLoading(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl ved sletningen af opgaven" });
        });
    }
}
