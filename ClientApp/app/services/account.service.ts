import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { ORIGIN_URL } from '../shared/constants/baseurl.constants';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Student } from '../model/student'

@Injectable()
export class AccountService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    public loggedIn: BehaviorSubject<String> = new BehaviorSubject("void");

    constructor(private http: Http, private router: Router, private transferHttp: TransferHttp, @Inject(ORIGIN_URL) private baseUrl: string) {
        this.transferHttp
            .get(this.baseUrl + '/api/account/status', this.options)
            .catch(this.handleError)
            .subscribe(value => this.loggedIn.next(value.role));
    }

    makeAdmin(username: string, password: string, email: string): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/account/registeradminuser', JSON.stringify({ UserName: username, Password: password, Email: email }), this.options)
            .catch(this.handleError);
    }

    changePassword(currentPassword: string, newPassword: string): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/account/changepassword/', JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword }), this.options)
            .catch(this.handleError);
    }

    resetPassword(userId: string, code: string, newPassword: string): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/account/resetpassword/', JSON.stringify({ userId: userId, code: code, newPassword: newPassword }), this.options)
            .catch(this.handleError);
    }

    forgotPassword(email: string): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/account/forgotpassword/', JSON.stringify(email), this.options)
            .catch(this.handleError);
    }

    login(username: string, password: string): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/account/login/', JSON.stringify({ UserName: username, Password: password }), this.options)
            .map(res => { if (res.ok) { this.loggedIn.next("business"); this.updateToken(); } return res; })
            .catch(this.handleError);
    }

    adminLogin(username: string, password: string): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/account/adminlogin/', JSON.stringify({ UserName: username, Password: password }), this.options)
            .map(res => { if (res.ok) { this.loggedIn.next("admin"); this.updateToken(); } return res; })
            .catch(this.handleError);
    }

    logout(): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/account/logout', this.options)
            .map(res => { if (res.ok) { this.loggedIn.next("void"); this.updateToken(); } return res; })
            .catch(this.handleError);
    }

    registerUser(username: string, password: string, email: string): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/account/registerbusinessuser', JSON.stringify({ UserName: username, Password: password, Email: email }), this.options)
            .catch(this.handleError);
    }

    updateToken() {
        this.transferHttp
            .get(this.baseUrl + '/api/account/updateTokens', this.options)
            .subscribe();
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error);
    }
}
