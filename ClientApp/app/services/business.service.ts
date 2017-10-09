import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { ORIGIN_URL } from '../shared/constants/baseurl.constants';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Business } from '../model/business';

@Injectable()
export class BusinessService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private router: Router, private transferHttp: TransferHttp, @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    updateBusiness(b: Business): Observable<Business> {
        let business = {
            Id: b.id,
            Name: b.name,
            LogoUrl: b.logoUrl,
            Description: b.description,
            Address: b.address,
            Zip: b.zip,
            City: b.city,
            UserId: b.userId
        };
        let user = {
            Id: b.userId,
            UserName: b.username,
            Email: b.email
        };
        return this.http
            .put(this.baseUrl + '/api/businesses/', JSON.stringify({ business: business, user: user }), this.options)
            .catch(this.handleError);
    }

    createBusiness(b: Business, userId): Observable<Business> {
        let business = {
            Name: b.name,
            LogoUrl: b.logoUrl,
            Description: b.description,
            Address: b.address,
            Zip: b.zip,
            City: b.city,
            UserId: userId
        }
        return this.http
            .post(this.baseUrl + '/api/businesses/', JSON.stringify(business), this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getBusinessWithTasks(): Observable<Business> {
        return this.http
            .get(this.baseUrl + '/api/businesses/withtasks', this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    getBusinessFromId(id: number): Observable<Business> {
        return this.http
            .get(this.baseUrl + '/api/businesses/' + id, this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getBusinessFromUser(): Observable<Business> {
        return this.http
            .get(this.baseUrl + '/api/businesses', this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        var data = res.json();
        if (!data) {
            return {};
        } else if (data.tasks.length > 0) {
            data.tasks.forEach((d) => {
                d.deadline = moment(d.deadline);
                d.creationTime = moment(d.creationTime);
            })
        }
        return data;
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    }
}
