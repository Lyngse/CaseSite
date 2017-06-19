import * as moment from 'moment';

export class Job {
    id: number;
    title: string;
    deadline: moment.Moment;
    description: string;
    maxNumPersons: number;
    minNumPersons: number;
    rewardType: string;
    rewardValue: number;
    workPlace: string;
    city: string;
    zip: number;
    street: string;
    jobType: string;
    businessId: number;
    businessName: string;
    applicationDescription: string;
    solutionEmail: string;

    constructor() {
        this.deadline = moment();
    }
}