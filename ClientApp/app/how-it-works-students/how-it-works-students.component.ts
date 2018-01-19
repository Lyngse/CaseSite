import { Component } from '@angular/core';

@Component({
    selector: 'how-it-works-students',
    templateUrl: './how-it-works-students.component.html',
    styleUrls: ['./how-it-works-students.component.css']
})
export class HowItWorksStudentsComponent {
    atBusiness = [
        { number: 1, title: "Ansøg hos <br /> virksomheden", description: "Upload din ansøgning til virksomheden og forklar hvorfor virksomheden skal vælge netop dig til at udarbejde løsningsforslaget i samarbejde med virksomheden." },
        { number: 2, title: "Virksomheden <br /> vælger dig", description: "Virksomheden gennemgår de uploadede ansøgninger, hvorefter den udvælger en eller flere studerende." },
        { number: 3, title: "Du udarbejder løsningsforslaget", description: "Hvis du er blevet udvalgt, begyndes udarbejdelsen af løsningsforslaget." },
        { number: 4, title: "Modtag belønning af virksomheden", description: "Når du har løst opgaven vil du modtage den oplyste belønning fra virksomheden." }
    ];

    atHome = [
        { number: 1, title: "Udarbejd <br />løsningsforslag", description: "Udarbejd dit løsningsforslag til virksomhedens opstillede opgave." },
        { number: 2, title: "Upload <br /> løsningsforslaget", description: "Efter udarbejdelsen af løsningsforslaget uploades løsningsforslaget til virksomheden." },
        { number: 3, title: "Modtag belønning af virksomheden", description: "Når deadline er udløbet vælger virksomheden den bedste løsning.Den studerende bag løsningsforslaget modtager den angivne belønning fra virksomheden." }
    ];

    constructor() {

    }

}
