﻿import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { ORIGIN_URL } from '../shared/constants/baseurl.constants';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Solution } from '../model/solution';
import * as moment from 'moment';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class SolutionService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });


    constructor(private http: Http, private router: Router, private transferHttp: TransferHttp, @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    createSolution(studentId: number, taskId: number): Observable<Solution> {
        return this.http
            .post(this.baseUrl + '/api/solutions/createsolution', JSON.stringify({ studentId: studentId, taskId: taskId }), this.options)
            .catch(this.handleError);
    }

    getSolution(id: number): Observable<Solution> {
        return this.http
            .get(this.baseUrl + '/api/solutions/getsolution/' + id, this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getTaskSolutions(taskId: number): Observable<Solution[]> {
        return this.http
            .get(this.baseUrl + '/api/solutions/gettasksolutions/' + taskId, this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    getStudentSolutions(): Observable<Solution[]> {
        return this.http
            .get(this.baseUrl + '/api/solutions/getstudentsolutions', this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    selectWinner(taskId: number, studentId: number): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/solutions/selectwinner', JSON.stringify({ taskId: taskId, studentId: studentId }), this.options)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        var data = res.json();
        if (!data) {
            return {};
        } else if (data.length) {
            data.forEach((d) => {
                d.task.deadline = moment(d.task.deadline);
                d.task.creationTime = moment(d.task.creationTime);
            })
        } else if (data.task) {
            data.task.deadline = moment(data.task.deadline);
            data.task.creationTime = moment(data.task.creationTime);
        }
        return data;
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    }
}
