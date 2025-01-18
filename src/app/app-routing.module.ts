import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { AboutusComponent } from './views/aboutus/aboutus.component';
import { OurservicesComponent } from './views/ourservices/ourservices.component';
import { ProductsComponent } from './views/products/products.component';
import { TestComponent } from './views/test/test.component';
import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './views/terms-of-service/terms-of-service.component';
import { DataDeletionComponent } from './views/data-deletion/data-deletion.component';
import { FeedbackFormComponent } from './views/feedback-form/feedback-form.component';
import { TermsComponent } from './views/terms/terms.component';
import { SocialMediaLinksComponent } from './views/social-media-links/social-media-links.component';
import { LoginComponent } from './views/login/login.component';
import { authGuard } from './guards/auth.guard';
const routes: Routes = [
  
  {path:'',component:WelcomeComponent },
  {path:'aboutus',component:AboutusComponent  },
  {path:'ourservices',component:OurservicesComponent },
  {path:'products',component:ProductsComponent},
  {path:'test',component:TestComponent},
  {path:'privacy-policy',component:PrivacyPolicyComponent },
  {path:'terms-of-service',component:TermsOfServiceComponent },
  {path:'data-deletion',component:DataDeletionComponent },
  {path:'comments',component:FeedbackFormComponent  },
  {path:'terms',component:TermsComponent  },
  {path:'linkssocial',component:SocialMediaLinksComponent  },
  {path:'login',component:LoginComponent },
   // Lazy load para el módulo ERP
   {
    path: 'erp',
    loadChildren: () => import('./erp/erp.module').then(m => m.ErpModule),
    canActivate: [authGuard ] // Protege el módulo ERP con authGuard 
  }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],//imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
