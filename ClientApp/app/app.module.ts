import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './components/app/app.component';
import { FrontpageComponent } from './components/frontpage/frontpage.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        HeaderComponent,
        FrontpageComponent,
        FooterComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot([
            { path: '', redirectTo: 'frontpage', pathMatch: 'full' },
            { path: 'frontpage', component: FrontpageComponent },
            { path: '**', redirectTo: 'frontpage' }
        ])
    ]
})
export class AppModule {
}
