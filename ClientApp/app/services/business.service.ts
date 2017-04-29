import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { Business } from '../model/business';

@Injectable()
export class BusinessService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private router: Router) {

    }

    createBusiness(b: Business): Promise<Business> {
        return this.http
            .post('api/businesses/', JSON.stringify(b), this.options)
            .toPromise()
            .then((res) => {
                if (res.ok == true) {
                    return res.json().data
                } else {
                    console.log("What to do ?")
                }         
            })
            .catch(this.handleError);
    }

    getBusinessInfo(): Promise<Business> {
        return this.http
            .get('api/businesses', this.options)
            .toPromise()
            .then((res) => {
                if (res.status == 401) {
                    this.router.navigate(['/login']);
                } else if (res.ok == true) {
                    return res.json().data
                }
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
