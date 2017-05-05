import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import { Job } from '../model/job';

@Injectable()
export class JobService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private router: Router) {

    }

    getAllJobs(): Observable<Job[]> {
        return this.http
            .get('api/jobs', this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    createJob(j: Job): Observable<Job> {
        let job = {
            Deadline: j.deadline,
            Title: j.title,
            Description: j.description,
            MaxNumPersons: j.maxNumOfPersons,
            MinNumPersons: j.minNumOfPersons,
            RewardValue: j.rewardValue,
            WorkPlace: j.workPlace,
            JobType: j.jobType
        }
        return this.http
            .post('api/jobs', JSON.stringify(job), this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getJobsForBusiness(): Observable<Job[]> {
        return this.http
            .get('api/jobs/business', this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    }
}
