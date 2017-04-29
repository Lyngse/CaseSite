import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class AccountService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {

    }

    login(username: string, password: string): Promise<any> {
        return this.http
            .post('api/account/login/', JSON.stringify({ UserName: username, Password: password }), this.options)
            .toPromise()
            .catch(this.handleError);
    }

    logout(): Promise<any> {
        return this.http
            .post('api/account/logout', this.options)
            .toPromise()
            .catch(this.handleError);
    }

    registerUser(username: string, password: string, email: string): Promise<any> {
        return this.http
            .post('api/account/registerbusinessuser', JSON.stringify({ UserName: username, Password: password, Email: email }), this.options)
            .toPromise()
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
