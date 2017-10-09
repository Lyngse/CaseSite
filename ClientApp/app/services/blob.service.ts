import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { ORIGIN_URL } from '../shared/constants/baseurl.constants';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class BlobService {

    private headers = new Headers();
    options = new RequestOptions({ headers: this.headers });
    

    constructor(private http: Http, private router: Router, private transferHttp: TransferHttp, @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    uploadLogo(file: FormData, id: number): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/blob/uploadlogo/' + id, file, this.options)
            .catch(this.handleError);
    }

    uploadAttachments(files: FormData, taskId: number): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/blob/uploadattachments/' + taskId, files, this.options)
            .catch(this.handleError);
    }

    deleteAttachment(taskId: number, fileName: string): Observable<any> {
        var localHeader = new Headers({ 'Content-Type': 'application/json' });

        return this.http
            .post(this.baseUrl + '/api/blob/deleteattachment', JSON.stringify({ taskId: taskId, fileName: fileName }), new RequestOptions({ headers: localHeader }))
            .catch(this.handleError);
    }

    getAttachments(taskId: number): Observable<any> {
        return this.http
            .get(this.baseUrl + '/api/blob/getattachments/' + taskId, this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getAttachmentNames(taskId: number): Observable<any> {
        return this.http
            .get(this.baseUrl + '/api/blob/getattachmentnames/' + taskId, this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    uploadSolutionFiles(files: FormData, taskId: number, studentId: number): Observable<any> {
        return this.http
            .post(this.baseUrl + '/api/blob/uploadsolution/' + taskId + '/' + studentId, files, this.options)
            .map(res => res)
            .catch(this.handleError);
    }

    deleteSolutionFile(taskId: number, studentId: number, fileName: string): Observable<any> {
        var localHeader = new Headers({ 'Content-Type': 'application/json' });
        return this.http
            .post(this.baseUrl + '/api/blob/deletesolution', JSON.stringify({ taskId: taskId, studentId: studentId, fileName: fileName }), new RequestOptions({ headers: localHeader }))
            .catch(this.handleError);
    }

    getSolutionFiles(taskId: number, studentId: number): Observable<any> {
        return this.http
            .get(this.baseUrl + '/api/blob/getsolutions/' + taskId + '/' + studentId, this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    } 
}
