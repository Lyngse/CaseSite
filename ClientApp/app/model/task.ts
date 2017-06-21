import * as moment from 'moment';

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
    businessName: string;

    constructor() {
        this.deadline = moment();
        this.creationTime = moment();
    }
}