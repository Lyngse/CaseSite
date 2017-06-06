﻿import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

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

    deleteJob(id: number): Observable<Job> {
        return this.http
            .delete('api/jobs/' + id, this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    getJob(id: number): Observable<Job> {
        return this.http
            .get('api/jobs/' + id, this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    getAllJobs(): Observable<Job[]> {
        return this.http
            .get('api/jobs', this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    createJob(j: Job): Observable<Job> {
        let job = {
            Deadline: j.deadline,
            Title: j.title,
            Description: j.description,
            MaxNumPersons: j.maxNumPersons,
            MinNumPersons: j.minNumPersons,
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
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        var data = res.json();
        if (!data) {
            return {};
        } else if (data.length) {
            data.forEach((d) => {
                d.deadline = moment(d.deadline);
            })
        } else {
            data.deadline = moment(data.deadline);
        }
        return data;
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    }
}
