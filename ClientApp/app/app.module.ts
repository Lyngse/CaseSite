import { NgModule } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule, routingComponents } from './app-router.module';
import { FormsModule } from '@angular/forms';
import { SpinnerModule } from 'angular2-spinner';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskCardComponent } from './tasks/task-list/task-card/task-card.component';
import { ModalModule, TooltipModule, TimepickerModule, DatepickerModule, AlertModule, AccordionModule } from 'ngx-bootstrap';
import { AdminBusinessComponent } from './admin/admin-business/admin-business.component';
import { AdminTaskComponent } from './admin/admin-task/admin-task.component';
import { AdminStudentComponent } from './admin/admin-student/admin-student.component';
import { AdminSolutionComponent } from './admin/admin-solution/admin-solution.component';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';


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
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        routingComponents,
        HeaderComponent,
        FooterComponent,
        TaskListComponent,
        TaskCardComponent,
        EqualValidator,
        DanishCurrencyPipe,
        FormatTextPipe,
        AdminTaskComponent,
        AdminBusinessComponent,
        AdminStudentComponent,
        AdminSolutionComponent,
    ],
    imports: [
        CommonModule,
        HttpModule,
        RouterModule,
        AppRoutingModule,
        FormsModule,
        SpinnerModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        TimepickerModule.forRoot(),
        DatepickerModule.forRoot(),
        AlertModule.forRoot(),
        AccordionModule.forRoot(),
        TransferHttpModule, 
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
    ],

    providers: [BusinessService, AccountService, TaskService, UtilService, BlobService, StudentService, SolutionService, AdminService]
})
export class AppModuleShared {
}
