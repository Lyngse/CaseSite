import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-router.module';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { JobSearchComponent } from './jobs/job-search/job-search.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobCardComponent } from './jobs/job-list/job-card/job-card.component';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        routingComponents,
        HeaderComponent,
        FrontpageComponent,
        FooterComponent,
        JobSearchComponent,
        JobListComponent,
        JobCardComponent,

    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        AppRoutingModule,
    ]
})
export class AppModule {
}
