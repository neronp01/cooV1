import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard';
import { EnregistrementComponent } from './enregistrement/enregistrement.component';
import { SelectivePreloadingStrategy } from './services/selective-preloading-strategy';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { HomeComponent} from './home/home.component'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'membre', component: AppComponent , canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: 'home', component: HomeComponent },
          { path: 'inscription', component: EnregistrementComponent},
        ]
      }],
  },
  // otherwise redirect to home
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,
    {
      enableTracing: true, // <-- debugging purposes only
      preloadingStrategy: SelectivePreloadingStrategy,
    }
  ),
    RouterModule.forChild(routes)

  ],
  exports: [ RouterModule ],
  providers: [
    CanDeactivateGuard,
    SelectivePreloadingStrategy
  ]
})
export class AppRoutingModule {}
