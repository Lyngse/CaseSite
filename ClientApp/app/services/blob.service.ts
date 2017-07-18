import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class BlobService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });
    

    constructor(private http: Http, private router: Router) {

    }

    uploadLogo(file: FormData, id: number): Observable<any> {
        return this.http
            .post('api/blob/uploadlogo/' + id, file, this.options)
            .catch(this.handleError);
    }

    uploadFiles(files: FormData, taskId: number): Observable<any> {
        return this.http
            .post('api/blob/uploadfiles/' + taskId, files, this.options)
            .catch(this.handleError);
    }

    deleteFile(taskId: number, fileName: string): Observable<any> {
        return this.http
            .post('api/blob/deletefile', JSON.stringify({ taskId: taskId, fileName: fileName }), this.options)
            .catch(this.handleError);
    }

    getFiles(taskId: number): Observable<any> {
        return this.http
            .get('api/blob/getfiles/' + taskId, this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Observable.throw(error.message || error)
    } 
}
