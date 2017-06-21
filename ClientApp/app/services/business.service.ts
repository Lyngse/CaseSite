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

    updateBusiness(b: Business): Observable<Business> {
        let business = {
            Name: b.name,
            LogoUrl: b.logo,
            Description: b.description,
            Address: b.address,
            Zip: b.zip,
            City: b.city
        };
        let user = {
            UserName: b.username,
            Email: b.email
        };
        return this.http
            .put('api/businesses/', JSON.stringify({ business: business, user: user }), this.options)
            .map(res => console.log(res))
            .catch(this.handleError);
    }

    createBusiness(b: Business, userId): Observable<Business> {
        let business = {
            Name: b.name,
            LogoUrl: b.logo,
            Description: b.description,
            Address: b.address,
            Zip: b.zip,
            City: b.city,
            UserId: userId
        }
        return this.http
            .post('api/businesses/', JSON.stringify(business), this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getBusinessFromId(id: number): Observable<Business> {
        return this.http
            .get('api/businesses/' + id, this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getBusinessFromUser(): Observable<Business> {
        return this.http
            .get('api/businesses', this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    }
}
