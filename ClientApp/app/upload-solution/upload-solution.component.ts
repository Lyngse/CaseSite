import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../services/account.service';
import { StudentService } from '../services/student.service';
import { UtilService } from '../services/util.service';
import { BlobService } from '../services/blob.service';
import { SolutionService } from '../services/solution.service';
import { TaskService } from '../services/task.service';
import { Student } from '../model/student';
import * as moment from 'moment';

@Component({
    selector: 'upload-solution',
    templateUrl: './upload-solution.component.html',
    styleUrls: ['./upload-solution.component.css']
})
export class UploadSolutionComponent implements AfterViewInit {
    student: Student;
    solutions: any;
    taskId: number;
    studentId: number;
    formData: FormData = new FormData();
    filesChanged: boolean = false;
    solutionsLoaded: boolean = false;
    enableUpload: boolean = true;


    constructor(private router: Router,
        private studentService: StudentService,
        private accountService: AccountService,
        private utilService: UtilService,
        private blobService: BlobService,
        private route: ActivatedRoute,
        private solutionService: SolutionService,
        private taskService: TaskService) {
        this.accountService.loggedIn.subscribe(newValue => {
            if (newValue === "student")
                this.studentService.getStudentFromUser().subscribe(res => {
                    this.student = res;
                    this.studentId = res.id;
                    if (this.taskId && this.studentId && !this.solutionsLoaded) {
                        this.getSolutionFiles(this.taskId, this.studentId);
                    }
                });
            else if (newValue === "admin") {
                console.log(this.utilService.dataArray);
                this.studentId = this.utilService.dataArray.studentId;
                this.taskId = this.utilService.dataArray.taskId;
                if (this.taskId && this.studentId && !this.solutionsLoaded) {
                    this.getSolutionFiles(this.taskId, this.studentId);
                }
            }
            else {
                this.router.navigate(['/frontpage']);
            }
        });
        this.solutionService
    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            this.taskId = params['taskId'];
            this.taskId = Number(this.taskId);
        });
    }

    fileChange(event) {
        this.filesChanged = true;
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            for (let i = 0; i < fileList.length; i++) {
                let file: File = fileList[i];
                this.formData.append('uploadFile', file, file.name);
            }
        }
    }

    formatFileName(filePath: string) {
        return filePath.slice(filePath.lastIndexOf('/') + 1, filePath.length);
    }

    uploadSolution() {
        this.utilService.displayLoading(true);
        this.solutionService.createSolution(this.student.id, this.taskId).subscribe(res => {
            console.log(res);
            this.blobService.uploadSolutionFiles(this.formData, this.taskId, this.student.id).subscribe(res => {
                console.log(res);
                if (res.ok) {
                    this.utilService.displayLoading(false);
                    this.utilService.alert.next({ type: "success", titel: "Success", message: "Filer til løsningsforslag er blevet uploadet" });
                    this.router.navigate(['/student']);
                } else {
                    this.utilService.displayLoading(false);
                    this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl under upload af filerne" });
                }
            }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl under upload af filerne" });
                });
        });
    }

    getSolutionFiles(taskId, studentId) {
        this.utilService.displayLoading(true);
        this.taskService.getTask(taskId).subscribe(res => {
            if (res.deadline > moment()) {
                this.enableUpload = true;
            }
            else {
                this.enableUpload = false;
            }
            this.blobService.getSolutionFiles(taskId, studentId).subscribe(res => {
                if (res != null) {
                    this.utilService.displayLoading(false);
                    this.solutions = res;
                    this.solutions.forEach((f) => {
                        f.fileName = this.formatFileName(f.name)
                    });
                    console.log(res);
                    this.solutionsLoaded = true;
                }
            }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Kunne ikke hente allerede uploadede filer" });
            });
        })

    }

    deleteSolution(fileName: string) {
        this.utilService.displayLoading(true);
        this.blobService.deleteSolutionFile(this.taskId, this.studentId, fileName).subscribe(res => {
            if (res.ok) {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "success", titel: "Success", message: "Filen er blevet slettet" });
                this.getSolutionFiles(this.taskId, this.studentId);
            } else {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl, filen kunne ikke slettes" });
            }
        }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl, kunne ikke slette filen" });
            });
    }   

}