import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-router.module';
import { FormsModule } from '@angular/forms';
import { SpinnerModule } from 'angular2-spinner';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { JobSearchComponent } from './jobs/job-search/job-search.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobCardComponent } from './jobs/job-list/job-card/job-card.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './login/resetpassword/resetpassword.component';

import { BusinessService } from './services/business.service';
import { AccountService } from './services/account.service';
import { TaskService } from './services/task.service';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        routingComponents,
        HeaderComponent,
        FooterComponent,
        JobSearchComponent,
        JobListComponent,
        JobCardComponent,
        LoginComponent,
        ResetPasswordComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        AppRoutingModule,
        FormsModule,
        SpinnerModule
    ],
    providers: [BusinessService, AccountService, TaskService]
})
export class AppModule {
}
