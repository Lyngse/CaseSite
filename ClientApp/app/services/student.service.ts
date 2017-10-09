import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { ORIGIN_URL } from '../shared/constants/baseurl.constants';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Student } from '../model/student'

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class StudentService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private router: Router, private transferHttp: TransferHttp, @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getStudentFromUser(): Observable<Student> {
        return this.http
            .get(this.baseUrl + "/api/student", this.options)
            .map(res => res.json())
            .catch(this.handleError);      
    }

    getStudentFromId(studentId: number): Observable<Student> {
        return this.http
            .get(this.baseUrl + "/api/student/" + studentId, this.options)
            .map(res => res.json)
            .catch(this.handleError);
    }

    acceptTerms(): Observable<Student> {
        return this.http
            .get(this.baseUrl + "/api/student/studentacceptterms", this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    }
}
