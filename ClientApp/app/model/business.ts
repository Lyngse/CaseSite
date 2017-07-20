import { Task } from './task';

export class Business {

    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    description: string;
    logoUrl: string;
    address: string;
    zip: number;
    city: string;
    tasks: Task[];

    constructor() {
    
    }
}