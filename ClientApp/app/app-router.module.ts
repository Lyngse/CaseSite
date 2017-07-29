import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrontpageComponent } from './frontpage/frontpage.component';
import { TasksComponent } from './tasks/tasks.component';
import { BuisnessRegisterComponent } from './business-register/business-register.component';
import { BusinessManagerComponent } from './business-manager/business-manager.component';
import { BusinessTaskSolutionsComponent } from './business-manager/business-task-solutions/business-task-solutions.component';
import { LoginComponent } from './login/login.component';
import { CreateEditTaskComponent } from './business-manager/create-edit-task/create-edit-task.component';
import { BusinessEditComponent } from './business-manager/business-edit/business-edit.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { ResetPasswordComponent } from './login/resetpassword/resetpassword.component';
import { ForgotPasswordComponent } from './login/forgotpassword/forgotpassword.component';
import { ChangePasswordComponent } from './login/changepassword/changepassword.component';
import { HowItWorksStudentsComponent } from './how-it-works-students/how-it-works-students.component';
import { HowItWorksBusinessComponent } from './how-it-works-business/how-it-works-business.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { TermsComponent } from './terms/terms.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { UploadSolutionComponent } from './upload-solution/upload-solution.component';
import { DownloadSolutionComponent } from './business-manager/download-solution/download-solution.component';
import { FAQComponent } from './faq/faq.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

const routes: Routes = [
    { path: '', redirectTo: 'frontpage', pathMatch: 'full' },
    { path: 'frontpage', component: FrontpageComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'tasks/detail/:id', component: TaskDetailComponent },
    { path: 'business/register', component: BuisnessRegisterComponent },
    { path: 'business', component: BusinessManagerComponent },
    { path: 'business/createedittask', component: CreateEditTaskComponent },
    { path: 'business/createedittask/:id', component: CreateEditTaskComponent },
    { path: 'business/businessSettings', component: BusinessEditComponent },
    { path: 'business/businessSettings/:id', component: BusinessEditComponent },
    { path: 'business/solutions/:id', component: BusinessTaskSolutionsComponent },
    { path: 'business/solutions/:taskId/download/:studentId', component: DownloadSolutionComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login/resetpassword', component: ResetPasswordComponent },
    { path: 'login/forgotpassword', component: ForgotPasswordComponent },
    { path: 'login/changepassword', component: ChangePasswordComponent },
    { path: 'howitworksstudents', component: HowItWorksStudentsComponent },
    { path: 'howitworksbusiness', component: HowItWorksBusinessComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'student', component: StudentProfileComponent },
    { path: 'student/uploadsolution/:taskId', component: UploadSolutionComponent },
    { path: 'faq', component: FAQComponent },
    { path: 'admin/:subpage', component: AdminComponent },
    { path: 'adminlogin', component: AdminLoginComponent },
    { path: '**', redirectTo: 'frontpage' }
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
    BusinessTaskSolutionsComponent,
    DownloadSolutionComponent,
    LoginComponent,
    CreateEditTaskComponent,
    BusinessEditComponent,
    TaskDetailComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    HowItWorksStudentsComponent,
    HowItWorksBusinessComponent,
    AboutComponent,
    ContactComponent,
    TermsComponent,
    StudentProfileComponent,
    UploadSolutionComponent,
    FAQComponent,
    AdminComponent,
    AdminLoginComponent
]