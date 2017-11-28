import { Solution } from './solution';

export class Student {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    facebookId: string;
    termsAccepted: boolean;
    solutions: Solution[];

    constructor() {

    }
}