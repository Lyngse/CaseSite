import * as moment from 'moment';
import { Business } from './business';
import { Solution } from './solution';

export class Task {
    id: number;
    title: string;
    deadline: moment.Moment;
    description: string;
    rewardType: string;
    rewardValue: number;
    workPlace: string;
    type: string;
    address: string;
    zip: number;
    city: string;
    creationTime: moment.Moment;
    businessId: number;
    business: Business;
    contactDescription: string;
    winnerSolutionId: number;
    winnerSolution: Solution;
    solutions: Solution[];

    constructor() {
        this.deadline = moment();
        this.creationTime = moment();
    }
}