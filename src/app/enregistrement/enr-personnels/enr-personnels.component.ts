import { Component, OnInit, Output, EventEmitter, ElementRef, Input, OnDestroy, Renderer2 , ViewChild} from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { InfPersoInscMembService, Membre } from '../../services/inf-perso-insc-memb.service';
import { FormGroup,  FormBuilder,  Validators, FormControl} from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {MatFormFieldControl} from '@angular/material/form-field';
import {FocusMonitor} from '@angular/cdk/a11y';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';



export class MyTel {
  constructor(public area: string, public exchange: string, public subscriber: string) {}
}

@Component({
  selector: 'my-tel-input',
  templateUrl: 'form-field-custom-control-example.html',
  styleUrls: ['form-field-custom-control-example.css'],
  providers: [{provide: MatFormFieldControl, useExisting: MyTelInput}],
  host: {
    '[class.floating]': 'shouldPlaceholderFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})

export class MyTelInput implements MatFormFieldControl<MyTel>, OnDestroy {
  static nextId = 0;

  @ Input() tabInf: object;
  parts: FormGroup;
  stateChanges = new Subject<void>();
  valuesArea= '';
  valuesExchange= '';
  valuesSubscriber= '';
  focused = false;
  ngControl = null;
  errorState = false;
  controlType = 'my-tel-input';
  get empty() {
    const n = this.parts.value;
    return !n.area && !n.exchange && !n.subscriber;
  }

  get shouldPlaceholderFloat() {
    return this.focused || !this.empty;
  }

  id = `my-tel-input-${MyTelInput.nextId++}`;

  describedBy = '';
  @ Output() telephone = new EventEmitter<string>();
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): MyTel | null {
    const n = this.parts.value;
    if (n.area.length === 3 && n.exchange.length === 3 && n.subscriber.length === 4) {
      return new MyTel(n.area, n.exchange, n.subscriber);
    }
    return null;
  }
  set value(tel: MyTel | null) {
    tel = tel || new MyTel('', '', '');
    this.parts.setValue({area: tel.area, exchange: tel.exchange, subscriber: tel.subscriber});
    this.stateChanges.next();
  }

  constructor(fb: FormBuilder, private fm: FocusMonitor, private elRef: ElementRef,
              renderer: Renderer2) {
    this.parts =  fb.group({
      'area': '',
      'exchange': '',
      'subscriber': '',
    });

    fm.monitor(elRef.nativeElement, renderer, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }
  onKeyArea(event: any, exchange: string, subscriber: string) {
    this.valuesArea = event.target.value;
    this.telephone.emit(this.valuesArea + exchange + subscriber);
  }
  onKeyExchange(area: string, event: any, subscriber: string) {
    this.valuesExchange = event.target.value;
    this.telephone.emit(area + this.valuesExchange + subscriber);
  }

  onKeySubscriber(area: string, exchange: string, event: any) {
    this.valuesSubscriber = event.target.value;
    this.telephone.emit(area + exchange + this.valuesSubscriber);
  }
}

@Component({
  selector: 'app-enr-personnels',
  templateUrl: './enr-personnels.component.html',
  styleUrls: ['./enr-personnels.component.css'],
  providers: [ AuthService , InfPersoInscMembService ],
  animations: [
  trigger('flyInOut', [
    state('inactive', style({
      transform: 'translateX(0)',
    })),
  state('active', style({
                          transform: 'translateX(1000)',
                        })),
transition('inactive => active',  animate('6000s')),
  transition('active => inactive', animate('6000s'))
])
]
})




export class EnrPersonnelsComponent implements OnInit {
  state= 'inactive';
  _abonnementType = 'Abonnement familliale';
  disabled = false;
  _page = '1 / 3';
  @ Output() fuillet = new EventEmitter<string>();
  @ Output() infoMembre = new EventEmitter<Membre>();
  @ Output() infoMembreConjoint = new EventEmitter<Membre>();
  @ Output() closeWindows = new EventEmitter<string>();
  @ Output() membreX: BehaviorSubject<Membre>;
  @ Input () etat: string;
  @ Input () courielAdmin: string;
  placeholder = 'Téléphone';
  selectedValue: string;
  tabInf =  {};
  membreForm: FormGroup;
  ischecked: boolean;
  membreAdd: Membre;
  courriel: string;
  value: MyTel;
  _telephone: string;
  _dateNaissance: string;
  parts: FormGroup;
  partsDate: FormGroup;
  date: string;
  @ViewChild('myForm')
  myform: FormGroup;
  courrielDisabled: boolean;
  cotisations = [
    {value: 'individuelle', viewValue: 'Cotisation individuelle'},
    {value: 'familiale', viewValue: 'Cotisation familiale'},
    {value: 'organisme', viewValue: 'Cotisation organisme'}
  ];
// ^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  constructor(private fb: FormBuilder, private memb: InfPersoInscMembService, private at: AuthService) {
    this.membreX =  new BehaviorSubject(this.tabInf);
    this.membreX.subscribe(x => {
      this.infoMembre.emit(x);
      }
    );
    at.user.subscribe( x => {
      if ( this.etat !== 'ajouterMembre') {
        this.formAssync(x.email);
        this.courriel = x.email;
      }
      }
    );
  }

  ngOnInit() {
    console.log('etat' , this.etat);
    if (this.etat === 'ajouterMembre') {
      this.courrielDisabled = false;
      this.courriel = '';
      console.log('ajoutmembre')
    } else {
      this.courrielDisabled = true
    }
    this.createForm();
    this.state = 'active';
  }
  createForm() {
    this.myform = new FormGroup({
      });
    this.membreForm = this.fb.group({
      prenomForm: ['', Validators.required ],
      nomForm: ['', Validators.required ],
      adresseForm: ['', Validators.required ],
      codePostalForm: ['', Validators.required ],
      villeForm: ['', Validators.required ],
      telephoneForm: ['', Validators ],
      professionForm: ['', Validators ],
      typeCotisationForm: ['', Validators.required  ],
      courrielFamForm: ['', Validators ],
    });
  }

  abonnementType(e) {
    this.ischecked = e.checked;
     if (e === 'familiale') {
       this._page = '1 / 3';
       this._abonnementType = 'Abonnement familliale';
     } else {
       this._page = '1 / 2';
       this._abonnementType = 'Abonnement non-familliale';
     }
  }

  sauverInfoMembre (prenom, nom , adresse , codePostal , ville , profession, dateNaissance, courriel) {
    if ( this._telephone === undefined ) {
      this._telephone = this.tabInf['telephone'];
    }
      this.memb.addInfoMembreConjouint( this.memb.ajouterMembre(courriel , courriel , nom , prenom , adresse ,
        codePostal, ville, profession , this._telephone ,
      dateNaissance , this.selectedValue ));
    this.closeWindows.emit('close');

  }

  next(prenom, nom , adresse , codePostal , ville , profession, dateNaissance) {
       if ( this._telephone === undefined ) {
      this._telephone = this.tabInf['telephone'];
    }

 //   const temp = this.memb.ajouterMembre(this.courriel, this.courriel, nom, prenom, adresse, codePostal, ville, profession, this._telephone, dateNaissance, this.selectedValue);
    const temp2 = this.memb.membreUpdateInfPerso(prenom, nom , adresse , codePostal , ville , this._telephone , profession, dateNaissance, this.selectedValue, this.membreAdd);
 //   this.memb.addInfoMembreNext(temp);
   this.memb.updateInfoMembre( temp2 );

    this.abonnementType(this.selectedValue);
      if ( this._abonnementType === 'Abonnement non-familliale') {
        this.fuillet.emit('enr-permissions');
      } else {

        this.memb.aUnConjouint(this.courriel).subscribe(
          x => {
            if (x.length === 0) {
              this.memb.addInfoMembreConjouint(
                this.memb.membreInitialisationConjouint('', '', this.courriel)
              )
            }
          } );
        this.fuillet.emit('enr-personnels-conj');
      }
    this.state = 'inactive';
 //   this.closeWindows.emit('close');


  }

  formAssync( email: string) {
    console.log( 'adm' , email);
    let _courriel: string;
    if (this.courielAdmin === undefined){
      _courriel = email;
    } else {
      _courriel = this.courielAdmin;
    }

    this.memb.infoMembre(_courriel).subscribe(
      x => {
        const tabInfMeta = x[0];
        let courriel: string;
        if (this.courielAdmin === undefined) {
          courriel = tabInfMeta['id'];
        } else {
          courriel = email;
        }
        if ( x.length === 1) {
          this.membreX.next(tabInfMeta);
          this.memb.test1();
          this.tabInf = tabInfMeta['data'];
          this.courriel = tabInfMeta['id'];
          this.membreForm = this.fb.group({
            prenomForm: [this.tabInf['prenom'], Validators.required ],
            nomForm: [this.tabInf['nom'], Validators.required ],
            adresseForm: [this.tabInf['adresse'], Validators.required ],
            codePostalForm: [this.tabInf['codePostal'], Validators.required ],
            villeForm: [this.tabInf['ville'], Validators.required ],
            telephoneForm: [this.tabInf['telephone'], Validators ],
            professionForm: [this.tabInf['profession'], Validators ],
            typeCotisationForm: [this.tabInf['typeCotisation'], Validators.required ],
            courrielForm: [courriel, Validators ],
          });

          const area = this.tabInf['telephone'].substring( 0 , 3 );
          const exchange = this.tabInf['telephone'].substring( 3 , 6 );
          const subscriber = this.tabInf['telephone'].substring( 6 , 10 );
          this.value = new MyTel( area , exchange , subscriber )
          // this.value = this.tabInf['telephone'];
          if (this.tabInf['typeCotisation'] !== undefined) {
            this.selectedValue = this.tabInf['typeCotisation'];
          }
          if (this.selectedValue === 'familiale') {
            this._abonnementType = 'Abonnement familliale';
          } else {
            this._abonnementType = 'Abonnement non-familliale'
          }
            if (this.tabInf['dateNaissance'] !== undefined) {
            this._dateNaissance = this.tabInf['dateNaissance'];
            }
            this.infoMembreConjoint.emit(this.memb.getDataConjouint);
            this.membreAdd = this.tabInf;
            this.infoMembre.emit(this.membreAdd);

          // this.memb.infoMembreConjouint.subscribe(  x => {
          //   const tab = x[0];
          //   this.infoMembreConjoint.emit(tab);
          // });
          this.infoMembre.emit(this.membreAdd);
        } else {
        this.ischecked = true;
          if ( this.etat === 'ajouterMembre' || this.etat === 'overviewEdit') {
          } else {    this.memb.addInfoMembre(); }
        }
      }
    );
  };

  get isDisabled(): boolean {
    let status: boolean;
    if (this.membreForm.status === 'VALID') {
      status = false;
    } else {
      status = true;
    }
    return status;
  }
  telephone(e) {
    this._telephone = e;
  }
}
