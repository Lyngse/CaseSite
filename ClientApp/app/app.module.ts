import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-router.module';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        HeaderComponent,
        FrontpageComponent,
        FooterComponent,
        routingComponents
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        AppRoutingModule,
    ]
})
export class AppModule {
}
