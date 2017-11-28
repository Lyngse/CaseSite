import { Component } from '@angular/core';

@Component({
    selector: 'how-it-works-business',
    templateUrl: './how-it-works-business.component.html',
    styleUrls: ['./how-it-works-business.component.css']
})
export class HowItWorksBusinessComponent {
    atHome = [
        { number: 1, title: "I uploader en <br /> opgave", description: "I uploader en opgave med deadline og belønning." },
        { number: 2, title: "Studerende uploader<br /> løsningsforslag", description: "De studerende udarbejder løsningsforslag, som vil blive uploadet direkte til opgaven, som kan ses under ’Mine opgaver’." },
        { number: 3, title: "I vælger det bedste <br /> løsningsforslag", description: "Når deadlinen er udløbet, udvælger I det bedste løsningsforslag ud fra de uploadede løsningsforslag." },
        { number: 4, title: "Belønning<br /> gives", description: "Herefter sendes belønningen til den studerende, der har udarbejdet det bedste løsningsforslag." },
    ];
    atBusiness = [
        { number: 1, title: "I uploader en <br /> opgave", description: "I uploader en opgave med beskrivelse, deadline og belønning." },
        { number: 2, title: "Studerende<br /> ansøger", description: "De studerende ansøger om at udarbejde løsningsforslaget hos jer." },
        { number: 3, title: "I udvælger den bedste ansøger <br /> og samarbejdet begynder", description: "Når deadlinen er overskredet udvælger I den bedste ansøger/ansøgere, som herefter påbegynder udarbejdelsen af løsningsforslaget hos jer." },
        { number: 4, title: "Belønning <br /> gives", description: "Efter løsningsforslaget er blevet udarbejdet hos jer tildeles den studerende den oplyste belønning." },
    ];

    constructor() {

    }

}
