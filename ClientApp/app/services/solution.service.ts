import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
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


    constructor(private http: Http, private router: Router) {

    }

    createSolution(studentId: number, taskId: number): Observable<Solution> {
        return this.http
            .post('api/solutions/createsolution', JSON.stringify({ studentId: studentId, taskId: taskId }), this.options)
            .catch(this.handleError);
    }

    getTaskSolutions(taskId: number): Observable<Solution[]> {
        return this.http
            .get('api/solutions/gettasksolutions/' + taskId, this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    getStudentSolutions(): Observable<Solution[]> {
        return this.http
            .get('api/solutions/getstudentsolutions', this.options)
            .map(res => this.extractData(res))
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
        } else {
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
