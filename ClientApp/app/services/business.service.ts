import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Business } from '../model/business';

@Injectable()
export class BusinessService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private router: Router) {

    }

    createBusiness(b: Business, userId): Observable<Business> {
        let business = {
            Name: b.name,
            Logo: b.logo,
            Description: b.description,
            UserId: userId
        }
        return this.http
            .post('api/businesses/', JSON.stringify(business), this.options)
            ..map(res => res.json())
            .catch(this.handleError);
    }

    getBusinessInfo(): Observable<Business> {
        return this.http
            .get('api/businesses', this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.json().error || 'Server error')
    }
}
