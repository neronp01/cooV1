import { BrowserModule } from '@angular/platform-browser';
import { NgModule , LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule , MatCheckboxModule, MatCardModule, MatGridListModule,
  MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSlideToggleModule,
  MatListModule , MatTabsModule, MatSelectModule, MatTableModule, MatMenuModule,
  MatAutocompleteModule, MatRadioModule,
  MatExpansionModule, MatToolbarModule, MatTooltipModule, MatDialogModule, MatSidenavModule} from '@angular/material';
import { AuthService } from './services/auth-service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'angular-calendar';



import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { EnregistrementComponent} from './enregistrement/enregistrement.component';
import { EnrPersonnelsComponent, MyTelInput  } from './enregistrement/enr-personnels/enr-personnels.component';
import { EnrPermissionsComponent } from './enregistrement/enr-permissions/enr-permissions.component';
import { EnrPersonnelsConjComponent, MyTelInputConj } from './enregistrement/enr-personnels-conj/enr-personnels-conj.component';
import { LoginRoutingModule } from './login/login-routing.module';
import { FactureComponent } from './enregistrement/facture/facture.component';
import { FormFieldDateComponent } from './enregistrement/form/form-field-date/form-field-date.component';
import { DateNaissanceValidationDirective } from './enregistrement/directiveValidation/date-naissance-validation.directive';
import { ErrorsComponent } from './enregistrement/errors/errors.component'
import { MakePaymentComponent } from './payments/make-payment/make-payment.component';
import { PaymentService } from './payments/payment/payment.service';
import { SendEmailComponent } from './send-email/send-email.component';
import { HomeComponent, DialogOverviewExampleDialog } from './home/home.component';
import { ListeComponent } from './home/liste/liste.component';
import { EmailComponent } from './home/email/email.component';
import { AdministrateurComponent} from './home/administrateur/administrateur.component';
import { CalendarComponent } from './home/calendar/calendar.component';
import { HideIconeDirective } from './home/calendar/hide-icone.directive';
import { EditMessageComponent } from './home/calendar/edit-message/edit-message.component';
import { InfPersoInscMembService } from './services/inf-perso-insc-memb.service';
import { InformationService } from './services/information.service';
import { TimerComponent } from './timer/timer.component'



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EnregistrementComponent,
    EnrPersonnelsComponent,
    EnrPermissionsComponent,
    EnrPersonnelsConjComponent,
    MyTelInput,
    MyTelInputConj,
    FactureComponent,
    FormFieldDateComponent,
    DateNaissanceValidationDirective,
    ErrorsComponent,
    MakePaymentComponent,
    SendEmailComponent,
    HomeComponent,
    ListeComponent,
    EmailComponent,
    DialogOverviewExampleDialog,
    AdministrateurComponent,
    CalendarComponent,
    HideIconeDirective,
    EditMessageComponent,
    TimerComponent,
  ],
  imports: [

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    FormsModule,
    CalendarModule.forRoot(),
    HttpModule,
    BrowserModule, BrowserAnimationsModule, NoopAnimationsModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatGridListModule,
    MatListModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSlideToggleModule, MatListModule, MatSelectModule,
    MatTabsModule, MatTableModule, MatToolbarModule, MatExpansionModule, MatTooltipModule, MatDialogModule, MatMenuModule, MatSidenavModule,
    MatAutocompleteModule, MatRadioModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-CA' },
    PaymentService,
    InfPersoInscMembService,
    InformationService,
  ],
  entryComponents: [
    DialogOverviewExampleDialog,
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
  constructor(router: Router) {
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
