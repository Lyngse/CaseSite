import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Business } from '../model/business';
import { Task } from '../model/task';

@Injectable()
export class BusinessService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private router: Router) {

    }

    getAllBusinesses(query?: string): Observable<Business[]> {
        return this.http
            .get('api/admin/getallbusinesses', this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getAllTasks(query?: string): Observable<Task[]> {
        return this.http
            .get('api/admin/getalltasks', this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    deleteBusiness(businessId: number): Observable<Business> {
        return this.http
            .delete('api/admin/deletebusiness' + businessId, this.options)
            .catch(this.handleError);
    }

    deleteTask(taskId: number): Observable<Task> {
        return this.http
            .delete('api/admin/deletetask/' + taskId, this.options)
            .catch(this.handleError);
    }

    updateBusiness(b: Business): Observable<Business> {
        let business = {
            Name: b.name,
            LogoUrl: b.logoUrl,
            Description: b.description,
            Address: b.address,
            Zip: b.zip,
            City: b.city,
            Email: b.email
        };
        return this.http
            .put('api/admin/updatebusiness', JSON.stringify({ business: business }), this.options)
            .catch(this.handleError);
    }

    updateTask(t: Task): Observable<Task> {
        let task = {
            Id: t.id,
            Title: t.title,
            Deadline: t.deadline,
            Description: t.description,
            ContactDescription: t.contactDescription,
            RewardType: t.rewardType,
            RewardValue: t.rewardValue,
            WorkPlace: t.workPlace,
            Type: t.type,
            Address: t.address,
            Zip: t.zip,
            City: t.city,
            CreationTime: t.creationTime
        };
        return this.http
            .put('api/admin/updatetask', JSON.stringify({ task: task }), this.options)
            .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        var data = res.json();
        if (!data) {
            return {};
        } else if (data.tasks.length > 1) {
            data.tasks.forEach((d) => {
                d.deadline = moment(d.deadline);
                d.creationTime = moment(d.creationTime);
            })
        } else {
            data.tasks[0].deadline = moment(data.tasks[0].deadline);
            data.tasks[0].creationTime = moment(data.tasks[0].creationTime);
        }
        return data;
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    }
}
