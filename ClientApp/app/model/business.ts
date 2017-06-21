export class Business {
    constructor(
        public id: number = null,
        public name: string = '',
        public username: string = '',
        public email: string = '',
        public password: string = '',
        public description: string = '',
        public logo: string = '',
        public city: string = '',
        public address: string = '',
        public zip: number = null
    ) {
    
    }
}