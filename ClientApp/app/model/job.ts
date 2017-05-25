import * as moment from 'moment';

export class Job {
    id: number;
    title: string;
    deadline: moment.Moment;
    description: string;
    maxNumPersons: number;
    minNumPersons: number;
    rewardValue: number;
    workPlace: string;
    jobType: string;
    businessId: number;
    businessName: string;
}