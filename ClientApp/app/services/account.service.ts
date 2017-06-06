﻿import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AccountService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    public loggedIn: BehaviorSubject<Boolean> = new BehaviorSubject(false);

    constructor(private http: Http, private router: Router) {
        this.http
            .get('api/account/status', this.options)
            .catch(this.handleError)
            .subscribe(value => this.loggedIn.next(value.json()));
    }

    login(username: string, password: string): Observable<any> {
        return this.http
            .post('api/account/login/', JSON.stringify({ UserName: username, Password: password }), this.options)
            .map(res => { this.loggedIn.next(true); return res; })
            .catch(this.handleError);
    }

    logout(): Observable<any> {
        return this.http
            .post('api/account/logout', this.options)
            .map(res => { this.loggedIn.next(false); return res; })
            .catch(this.handleError);
    }

    registerUser(username: string, password: string, email: string): Observable<any> {
        return this.http
            .post('api/account/registerbusinessuser', JSON.stringify({ UserName: username, Password: password, Email: email }), this.options)
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error);
    }
}
