import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
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

    constructor(private http: Http, private router: Router) {

    }

    getStudentFromUser(): Observable<Student> {
        return this.http
            .get("api/student", this.options)
            .map(res => res.json())
            .catch(this.handleError);      
    }

    getStudentFromId(studentId: number): Observable<Student> {
        return this.http
            .get("api/student/" + studentId, this.options)
            .map(res => res.json)
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    }
}
