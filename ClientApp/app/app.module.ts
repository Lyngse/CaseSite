import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-router.module';
import { FormsModule } from '@angular/forms';
import { SpinnerModule } from 'angular2-spinner';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskCardComponent } from './tasks/task-list/task-card/task-card.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './login/resetpassword/resetpassword.component';
import { ModalModule, TooltipModule, TimepickerModule, DatepickerModule, AlertModule, AccordionModule } from 'ngx-bootstrap';

import { DanishCurrencyPipe } from './shared/pipes/danishcurrency.pipe';
import { FormatTextPipe } from './shared/pipes/formatText.pipe';

import { EqualValidator } from './directives/equal-validator.directive';

import { BusinessService } from './services/business.service';
import { AccountService } from './services/account.service';
import { TaskService } from './services/task.service';
import { UtilService } from './services/util.service';
import { BlobService } from './services/blob.service';
import { StudentService } from './services/student.service';
import { SolutionService } from './services/solution.service';
import { AdminService } from './services/admin.service';
import { CookieService } from 'angular2-cookie/services';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        routingComponents,
        HeaderComponent,
        FooterComponent,
        TaskListComponent,
        TaskCardComponent,
        LoginComponent,
        ResetPasswordComponent,
        EqualValidator,
        DanishCurrencyPipe,
        FormatTextPipe,
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        AppRoutingModule,
        FormsModule,
        SpinnerModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        TimepickerModule.forRoot(),
        DatepickerModule.forRoot(),
        AlertModule.forRoot(),
        AccordionModule.forRoot(),

    ],

    providers: [BusinessService, AccountService, TaskService, UtilService, BlobService, CookieService, StudentService, SolutionService, AdminService]
})
export class AppModule {
}
