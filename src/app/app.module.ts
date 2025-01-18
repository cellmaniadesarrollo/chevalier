import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { NavbarComponent } from './layout/navbar/navbar.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importante para la animación de despliegue 
import { MatCardModule } from '@angular/material/card'; 

import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { FooterComponent } from './layout/footer/footer.component';
import { AboutusComponent } from './views/aboutus/aboutus.component';
import { BannerComponent } from './layout/banner/banner.component';
import { OurservicesComponent } from './views/ourservices/ourservices.component';
import { ProductsComponent } from './views/products/products.component';
import { TestComponent } from './views/test/test.component';
import { SafePipe } from './safe.pipe';
import { TiktokVideoComponent } from './layout/tiktok-video/tiktok-video.component';
import { TiktokCarrucelComponent } from './layout/tiktok-carrucel/tiktok-carrucel.component';
import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './views/terms-of-service/terms-of-service.component';
import { DataDeletionComponent } from './views/data-deletion/data-deletion.component';
import { FbPhotodisplayComponent } from './layout/fb-photodisplay/fb-photodisplay.component';
import { CarrucelwelcomeComponent } from './layout/carrucelwelcome/carrucelwelcome.component';
import { FeedbackFormComponent } from './views/feedback-form/feedback-form.component';
import { TermsComponent } from './views/terms/terms.component';
import { SocialMediaLinksComponent } from './views/social-media-links/social-media-links.component';
import { TeamMembersComponent } from './layout/team-members/team-members.component';
import { LoginComponent } from './views/login/login.component';   
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'i18n/', '.json');
}



@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    NavbarComponent,
    FooterComponent,
    AboutusComponent,
    BannerComponent,
    OurservicesComponent,
    ProductsComponent,
    TestComponent,
    SafePipe,
    TiktokVideoComponent,
    TiktokCarrucelComponent,
    PrivacyPolicyComponent,
    TermsOfServiceComponent,
    DataDeletionComponent,
    FbPhotodisplayComponent,
    CarrucelwelcomeComponent,
    FeedbackFormComponent,
    TermsComponent,
    SocialMediaLinksComponent,
    TeamMembersComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule, 
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule ,
    HttpClientModule,
    MatCardModule, 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), 
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(), 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
