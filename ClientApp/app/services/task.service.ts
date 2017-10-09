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


import { Task } from '../model/task';

@Injectable()
export class TaskService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private router: Router, private transferHttp: TransferHttp, @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getLatestTasks(): Observable<Task[]> {
        return this.http
            .get(this.baseUrl + '/api/tasks/getlatest', this.options)
            .map(res => this.extractData(res))
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
            .put(this.baseUrl + '/api/tasks', JSON.stringify(task), this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    deleteTask(id: number): Observable<Task> {
        return this.http
            .delete(this.baseUrl + '/api/tasks/' + id, this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    getTask(id: number): Observable<Task> {
        return this.http
            .get(this.baseUrl + '/api/tasks/' + id, this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    getAllTasks(): Observable<Task[]> {
        return this.http
            .get(this.baseUrl + '/api/tasks', this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    getTaskWithBusiness(taskId: number): Observable<Task> {
        return this.http
            .get(this.baseUrl + '/api/tasks/withbusiness/' + taskId, this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError);
    }

    createTask(t: Task): Observable<Task> {
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
            .post(this.baseUrl + '/api/tasks', JSON.stringify(task), this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }



    private extractData(res: Response) {
        var data = res.json();
        if (!data) {
            return {};
        } else if (data.length) {
            data.forEach((d) => {
                d.deadline = moment(d.deadline);
                d.creationTime = moment(d.creationTime);
            })
        } else {
            data.deadline = moment(data.deadline);
            data.creationTime = moment(data.creationTime);
        }
        return data;
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    }
}
