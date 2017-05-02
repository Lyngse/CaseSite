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
        let job = {
            Deadline: j.deadline,
            Title: j.title,
            Description: j.description,
            MaxNumPersons: j.maxNumOfPersons,
            MinNumPersons: j.minNumOfPersons,
            RewardValue: j.rewardValue
        }
        return this.http
            .post('api/jobs/', JSON.stringify(job), this.options)
            .toPromise()
            .then((res) => {
                if (res.ok == true) {
                    return res.json()
                } else {
                    console.log("What to do ?")
                }
            })
            .catch(this.handleError);
    }

    getJobsForBusiness(): Promise<Job[]> {
        return this.http
            .get('api/jobs/business', this.options)
            .toPromise().then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    //handle
                }
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
