import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { FacebookService, InitParams, LoginResponse, LoginStatus, LoginOptions } from 'ngx-facebook';

@Injectable()
export class AccountService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    public loggedIn: BehaviorSubject<Boolean> = new BehaviorSubject(false);

    constructor(private http: Http, private router: Router, private fb: FacebookService) {
        this.http
            .get('api/account/status', this.options)
            .catch(this.handleError)
            .subscribe(value => this.loggedIn.next(value.json()));

        let initParams: InitParams = {
            appId: '113893632577611',
            xfbml: true,
            cookie: true,
            version: 'v2.9'
        };

        fb.init(initParams);
    }

    changePassword(currentPassword: string, newPassword: string): Observable<any> {
        return this.http
            .post('api/account/changepassword/', JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword }), this.options)
            .catch(this.handleError);
    }

    resetPassword(userId: string, code: string, newPassword: string): Observable<any> {
        return this.http
            .post('api/account/resetpassword/', JSON.stringify({ userId: userId, code: code, newPassword: newPassword }), this.options)
            .catch(this.handleError);
    }

    forgotPassword(email: string): Observable<any> {
        return this.http
            .post('api/account/forgotpassword/', JSON.stringify(email), this.options)
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

    fblogin(): Promise<any> {
        return this.fb.getLoginStatus()
            .then((res) => {
                if (res.authResponse)
                    return this.loginWithFacebook(res.authResponse.userID);
                else {
                    const options: LoginOptions = {
                        scope: 'public_profile,email',
                        return_scopes: true
                    };
                    return this.fb.login(options)
                        .then((res) => {
                            if (res.authResponse)
                                return this.loginWithFacebook(res.authResponse.userID);
                            else
                                return Promise.reject("error logging in");
                        })
                        .catch(this.handleError);
                }
            })
            .catch(this.handleError);
    }

    loginWithFacebook(facebookId: string): Promise<any> {
        return this.http
            .post('api/account' + 'fblogin', JSON.stringify({facebookId: facebookId }), this.options)
            .toPromise()
            .then((res) => { let result = res.json(); result.facebookId = facebookId; })
            .catch((err) => {
                if (err.status === 404) {
                    return this.fb.api('/me?fields=id,last_name,first_name,email')
                        .then((res) => {
                            return this.fbRegister(res.id, res.first_name, res.last_name, res.email);
                        })
                        .catch(this.handleError);
                } else {
                    return this.handleError(err);
                }
            });
    }

    fbRegister(facebookId: string, firstname: string, lastname: string, email: string): Promise<any> {
        return this.http
            .post('api/student' + 'registerstudent', JSON.stringify({
                facebookId: facebookId,
                firtname: firstname,
                lastname: lastname,
                email: email
            }), this.options)
            .toPromise()
            .catch(this.handleError);
    }

    

    loginFacebook(): void {
        const options: LoginOptions = {
            scope: 'public_profile,user_friends,email,pages_show_list',
            return_scopes: true,
            enable_profile_selector: true
        };
        this.fb.login(options)
            .then((response: LoginResponse) => console.log(response))
            .catch((error: any) => console.error(error));

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
