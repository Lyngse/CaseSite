import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrontpageComponent } from './frontpage/frontpage.component';
import { TasksComponent } from './tasks/tasks.component';
import { BuisnessRegisterComponent } from './business-register/business-register.component';
import { BusinessManagerComponent } from './business-manager/business-manager.component';
import { LoginComponent } from './login/login.component';
import { CreateEditTaskComponent } from './business-manager/create-edit-task/create-edit-task.component';
import { BusinessEditComponent } from './business-manager/business-edit/business-edit.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { ResetPasswordComponent } from './login/resetpassword/resetpassword.component';
import { ForgotPasswordComponent } from './login/forgotpassword/forgotpassword.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';

const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'frontpage', component: FrontpageComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'tasks/detail/:id', component: TaskDetailComponent },
    { path: 'business/register', component: BuisnessRegisterComponent },
    { path: 'business', component: BusinessManagerComponent },
    { path: 'business/createedittask', component: CreateEditTaskComponent },
    { path: 'business/createedittask/:id', component: CreateEditTaskComponent },
    { path: 'business/businessSettings', component: BusinessEditComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login/resetpassword', component: ResetPasswordComponent },
    { path: 'login/forgotpassword', component: ForgotPasswordComponent },
    { path: 'hvordandetvirker', component: HowItWorksComponent },
    { path: '**', redirectTo: 'tasks' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }

export const routingComponents = [
    FrontpageComponent,
    TasksComponent,
    BuisnessRegisterComponent,
    BusinessManagerComponent,
    LoginComponent,
    CreateEditTaskComponent,
    BusinessEditComponent,
    TaskDetailComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    HowItWorksComponent
]