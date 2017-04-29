import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { Job } from '../model/job';

@Injectable()
export class JobService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private router: Router) {

    }

    createJob(j: Job): Promise<Job> {
        return this.http
            .post('api/businesses/', JSON.stringify(j), this.options)
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

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
