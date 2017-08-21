import { Solution } from './solution';

export class Student {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    facebookId: string;
    termsAccecpted: boolean;
    solutions: Solution[];

    constructor() {

    }
}