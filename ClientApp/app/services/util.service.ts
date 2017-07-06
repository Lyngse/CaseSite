import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class UtilService {
    public alert: BehaviorSubject<{ type: string, titel: string, message: string }> = new BehaviorSubject({type: null, titel: null, message: null});
}