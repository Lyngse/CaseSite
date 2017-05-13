import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrontpageComponent } from './frontpage/frontpage.component';
import { JobsComponent } from './jobs/jobs.component';
import { BuisnessRegisterComponent } from './business-register/business-register.component';
import { BusinessManagerComponent } from './business-manager/business-manager.component';
import { LoginComponent } from './login/login.component';
import { CreateEditJobComponent } from './business-manager/create-edit-job/create-edit-job.component';
import { BusinessEditComponent } from './business-manager/business-edit/business-edit.component';
import { JobDetailComponent } from './jobs/job-detail/job-detail.component';

const routes: Routes = [
    { path: '', redirectTo: 'frontpage', pathMatch: 'full' },
    { path: 'frontpage', component: FrontpageComponent },
    { path: 'jobs', component: JobsComponent },
    { path: 'jobs/detail/:id', component: JobDetailComponent },
    { path: 'registrervirksomhed', component: BuisnessRegisterComponent },
    { path: 'business', component: BusinessManagerComponent },
    { path: 'business/createeditjob', component: CreateEditJobComponent },
    { path: 'business/businessSettings', component: BusinessEditComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'frontpage' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }

export const routingComponents = [
    FrontpageComponent,
    JobsComponent,
    BuisnessRegisterComponent,
    BusinessManagerComponent,
    LoginComponent,
    CreateEditJobComponent,
    BusinessEditComponent,
    JobDetailComponent
]