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

    resetPassword(userId: string, code: string, newPassword: string): Observable<any> {
        return this.http
            .post('api/account/resetpassword/', JSON.stringify({ userId: userId, code: code, newPassword: newPassword }), this.options)
            .catch(this.handleError);
    }

    forgotPassword(email: string): Observable<any> {
        return this.http
            .post('api/account/forgotpassword/', JSON.stringify(email), this.options)
            .map(res => res.json)
            .catch(this.handleError);
    }

    login(username: string, password: string): Observable<any> {
        return this.http
            .post('api/account/login/', JSON.stringify({ UserName: username, Password: password }), this.options)
            .map(res => { this.loggedIn.next(true); this.updateToken(); return res; })
            .catch(this.handleError);
    }

    logout(): Observable<any> {
        return this.http
            .post('api/account/logout', this.options)
            .map(res => { this.loggedIn.next(false); this.updateToken(); return res; })
            .catch(this.handleError);
    }

    registerUser(username: string, password: string, email: string): Observable<any> {
        return this.http
            .post('api/account/registerbusinessuser', JSON.stringify({ UserName: username, Password: password, Email: email }), this.options)
            .catch(this.handleError);
    }

    private updateToken() {
        this.http
            .get('api/account/updateTokens', this.options)
            .subscribe();
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error);
    }
}
