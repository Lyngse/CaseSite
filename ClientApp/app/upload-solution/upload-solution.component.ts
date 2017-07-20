﻿import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../services/account.service';
import { StudentService } from '../services/student.service';
import { UtilService } from '../services/util.service';
import { BlobService } from '../services/blob.service';
import { Student } from '../model/student';

@Component({
    selector: 'upload-solution',
    templateUrl: './upload-solution.component.html',
    styleUrls: ['./upload-solution.component.css']
})
export class UploadSolutionComponent implements AfterViewInit {
    student: Student;
    solutions: any;
    taskId: number;
    formData: FormData = new FormData();
    filesChanged: boolean = false;
    solutionsLoaded: boolean = false;

    constructor(private router: Router,
        private studentService: StudentService,
        private accountService: AccountService,
        private utilService: UtilService,
        private blobService: BlobService,
        private route: ActivatedRoute) {
        this.accountService.loggedIn.subscribe(newValue => {
            if (newValue === "student")
                this.studentService.getStudentFromUser().subscribe(res => {
                    console.log(res);
                    this.student = res;
                    if (this.taskId && this.student.id && !this.solutionsLoaded) {
                        this.getSolutions();
                    }
                });
        });
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
        this.utilService.loading.next(true);
        this.blobService.uploadSolution(this.formData, this.taskId, this.student.id).subscribe(res => {
            console.log(res);
            if (res.ok) {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "success", titel: "Success", message: "Filer til løsningsforslag er blevet uploadet" });
                this.router.navigate(['/student']);
            } else {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl under upload af filerne" });
            }
        }, (err) => {
            this.utilService.loading.next(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl under upload af filerne" });
            });
    }

    getSolutions() {
        this.utilService.loading.next(true);
        this.blobService.getSolutions(this.taskId, this.student.id).subscribe(res => {
            if (res != null) {
                this.utilService.loading.next(false);
                this.solutions = res;
                this.solutions.forEach((f) => {
                    f.fileName = this.formatFileName(f.name)
                });
                console.log(res);
                this.solutionsLoaded = true;
            }
        }, (err) => {
            this.utilService.loading.next(false);
            this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Kunne ikke hente allerede uploadede filer" });
        });
    }

    deleteSolution(fileName: string) {
        this.utilService.loading.next(true);
        this.blobService.deleteSolution(this.taskId, this.student.id, fileName).subscribe(res => {
            if (res.ok) {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "success", titel: "Success", message: "Filen er blevet slettet" });
                this.getSolutions();
            } else {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl, filen kunne ikke slettes" });
            }
        }, (err) => {
                this.utilService.loading.next(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl, kunne ikke slette filen" });
            });
    }   

}