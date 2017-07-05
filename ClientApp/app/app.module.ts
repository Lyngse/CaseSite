import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-router.module';
import { FormsModule } from '@angular/forms';
import { SpinnerModule } from 'angular2-spinner';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TaskSearchComponent } from './tasks/task-search/task-search.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskCardComponent } from './tasks/task-list/task-card/task-card.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './login/resetpassword/resetpassword.component';
import { AlertModule, ModalModule } from 'ngx-bootstrap';

import { EqualValidator } from './directives/equal-validator.directive';

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
        TaskSearchComponent,
        TaskListComponent,
        TaskCardComponent,
        LoginComponent,
        ResetPasswordComponent,
        EqualValidator
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        AppRoutingModule,
        FormsModule,
        SpinnerModule,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
    ],
    providers: [BusinessService, AccountService, TaskService]
})
export class AppModule {
}
