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
import { Task } from '../model/task';
import { Student } from '../model/student';
import { Solution } from '../model/solution';

@Injectable()
export class AdminService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private router: Router, private transferHttp: TransferHttp, @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getCounts(): Observable<any> {
        return this.http
            .get(this.baseUrl + '/api/admin/getcounts', this.options)
            .map(res => res.json())
            .catch(this.handleError.bind(this));
    }

    getAllBusinesses(): Observable<Business[]> {
        return this.http
            .post(this.baseUrl + '/api/admin/getallbusinesses', this.options)
            .map(res => res.json())
            .catch(this.handleError.bind(this));
    }

    searchBusiness(query: string): Observable<Business[]> {
        return this.http
            .post(this.baseUrl + '/api/admin/getallbusinesses', JSON.stringify({ query: query}), this.options)
            .map(res => res.json())
            .catch(this.handleError.bind(this));
    }

    getAllTasks(): Observable<Task[]> {
        return this.http
            .post(this.baseUrl + '/api/admin/getalltasks', this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError.bind(this));
    }

    searchTask(query: string): Observable<Task[]> {
        return this.http
            .post(this.baseUrl + '/api/admin/getalltasks', JSON.stringify({ query: query }), this.options)
            .map(res => this.extractData(res))
            .catch(this.handleError.bind(this));
    }

    getAllStudents(): Observable<Student[]> {
        return this.http
            .post(this.baseUrl + '/api/admin/getallstudents', this.options)
            .map(res => res.json())
            .catch(this.handleError.bind(this));
    }

    searchStudent(query: string): Observable<Student[]> {
        return this.http
            .post(this.baseUrl + '/api/admin/getallstudents', JSON.stringify({ query: query }), this.options)
            .map(res => res.json())
            .catch(this.handleError.bind(this));
    }

    getAllSolutions(): Observable<Solution[]> {
        return this.http
            .post(this.baseUrl + '/api/admin/getallsolutions', this.options)
            .map(res => res.json())
            .catch(this.handleError.bind(this));
    }

    searchSolution(query: string): Observable<Solution[]> {
        return this.http
            .post(this.baseUrl + '/api/admin/getallsolutions', JSON.stringify({ query: query }), this.options)
            .map(res => res.json())
            .catch(this.handleError.bind(this));
    }

    deleteBusiness(businessId: number): Observable<any> {
        return this.http
            .delete(this.baseUrl + '/api/admin/deletebusiness/' + businessId, this.options)
            .catch(this.handleError.bind(this));
    }

    deleteTask(taskId: number): Observable<any> {
        return this.http
            .delete(this.baseUrl + '/api/admin/deletetask/' + taskId, this.options)
            .catch(this.handleError.bind(this));
    }

    updateBusiness(b: Business): Observable<any> {
        let business = {
            Id: b.id,
            Name: b.name,
            LogoUrl: b.logoUrl,
            Description: b.description,
            Address: b.address,
            Zip: b.zip,
            City: b.city,
            Email: b.email
        };
        return this.http
            .put(this.baseUrl + '/api/admin/updatebusiness', JSON.stringify({ business: business }), this.options)
            .catch(this.handleError.bind(this));
    }

    updateTask(t: Task): Observable<any> {
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
            .put(this.baseUrl + '/api/admin/updatetask', JSON.stringify({ task: task }), this.options)
            .catch(this.handleError.bind(this));
    }
    
    private extractData(res: Response) {
        var data = res.json();
        if (!data) {
            return {};
        }
        else if (data.length > 1) {
            data.forEach((d) => {
                d.deadline = moment(d.deadline);
                d.creationTime = moment(d.creationTime);
            })
        } else {
            data[0].deadline = moment(data[0].deadline);
            data[0].creationTime = moment(data[0].creationTime);
        }
        return data;
    }

    private handleError(error: any): Observable<any> {
        if (error && error.status === 401) {
            this.router.navigate(['/']);
        }
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    }
}
