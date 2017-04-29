import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { Business } from '../model/business';

@Injectable()
export class BusinessService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {

    }

    createBusiness(b: Business, userId): Promise<any> {
        let business = {
            Name: b.name,
            Logo: b.logo,
            Description: b.description,
            UserId: userId
        }
        return this.http
            .post('api/businesses/', JSON.stringify(business), this.options)
            .toPromise()
    }

    getBusinessInfo(): Promise<Business> {
        return this.http
            .get('api/businesses', this.options)
            .toPromise()
            .then((res) => {
                console.log(res);
                return res.json();
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
