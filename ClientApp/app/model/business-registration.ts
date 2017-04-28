export class BusinessRegistration {
    constructor(
        public name: string = '',
        public username: string = '',
        public email: string = '',
        public password: string = '',
        public description: string = '',
        public logo: string = '',
        public isAccepted: boolean = false
    ) {
    
    }
}