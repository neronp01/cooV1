import { Component, OnInit, Output, EventEmitter, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators} from '@angular/forms';
import { InfPersoInscMembService, Membre} from '../../services/inf-perso-insc-memb.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { AuthService } from '../../services/auth-service';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {MatFormFieldControl} from '@angular/material/form-field';
import {FocusMonitor} from '@angular/cdk/a11y';
import {Subject} from 'rxjs/Subject';
import * as firebase from 'firebase';

export class MyTel {
  constructor(public area: string, public exchange: string, public subscriber: string) {}
}

@Component({
  selector: 'my-tel-inputConjouint',
  templateUrl: 'form-field-custom-control-example.html',
  styleUrls: ['form-field-custom-control-example.css'],
  providers: [{provide: MatFormFieldControl, useExisting: MyTelInputConj }],
  host: {
    '[class.floating]': 'shouldPlaceholderFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})

export class MyTelInputConj implements MatFormFieldControl<MyTel>, OnDestroy {
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

  id = `my-tel-input-${MyTelInputConj.nextId++}`;

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
  selector: 'app-enr-personnels-conj',
  templateUrl: './enr-personnels-conj.component.html',
  styleUrls: ['./enr-personnels-conj.component.css'],
  providers:  [ AuthService ]
})

export class EnrPersonnelsConjComponent implements OnInit {
  @ Output() fuillet = new EventEmitter <string>();
  @ Input() infoMembreConjoint: object;
  @ Input () infoMembre: object;
  @ Input() membreX: BehaviorSubject<string>;
  membre: Observable<Membre>
  user: Observable<firebase.User>;
  _user: string;
  id= '';
  _membre: Membre;
  _page = '2 / 3'
  membreForm: FormGroup;
  tabMembres: Array<Membre>;
  uid: string;
  tabInf = {};
  placeholder = 'Téléphone';
  value: MyTel;
  _telephone: string;
  _dateNaissance: string;
  constructor(private fb: FormBuilder, private memb: InfPersoInscMembService , private se: AuthService) {
  this.membreX = new BehaviorSubject('');
  this.createFormInit();
  }

  createFormInit() {
    this.membreForm = this.fb.group({
      courrielForm: ['', Validators.email ],
      prenomForm: ['', Validators.required ],
      nomForm: ['', Validators.required ],
      telephoneForm: ['', Validators ],
      professionForm: ['', Validators ],
      dateNaissanceForm: ['', Validators ],
      courrielFamForm: ['', Validators ],
    });
  }
  createForm(s: object) {
    const data = s['data'];
    this.tabInf = data;
    const newDate = new Date(data.dateNaissance);
      this.membreForm = this.fb.group({
        courrielForm: [data.courriel, Validators.email],
        prenomForm: [data.prenom, Validators.required ],
        nomForm: [data.nom, Validators.required ],
        telephoneForm: [data.telephone, Validators ],
        professionForm: [data.profession, Validators ],
        dateNaissanceForm: [newDate, Validators ]
      });
    const area = data.telephone.substring( 0 , 3 );
    const exchange = data.telephone.substring( 3 , 6 );
    const subscriber = data.telephone.substring( 6 , 10 );
    this.value = new MyTel( area , exchange , subscriber );
    if (data.dateNaissance !== undefined) {
      this._dateNaissance = data.dateNaissance;
    }
  }


  ngOnInit() {

    this.user = this.se.user.map(
      x => { return x; }
    );
    this.user.subscribe( x => {
     // this.test3(x.email);
      this.trouverUid(x.email);
      this._user = x.email;
      this.uid = x.uid;
      this.test3();
     });
  }
  test3() {

    this.memb.infoMembre(this._user).subscribe( y => {
      const temp = y[0];
      this._membre = temp['data'];
    })
    // this.memb.trouverMembre(z);
    // this.membre = this.memb._membre.map(
    //   x => { return x; }
    // );
    // this.membre.subscribe( x =>
    // {
    //   this._membre = x[0].data
    // })
  }
  trouverUid(courriel: string) {
    this.tabMembres = [];
    let trouverUid: Observable<Membre[]>
    trouverUid = this.memb.trouverUidConj(courriel).snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Membre;
          const id = a.payload.doc.id;
          this.uid = id

          this.createForm(data);
          return { id, ...data };
        });
      });
    trouverUid.subscribe(
      x => console.log('subscrib', x )
    )
  }
  gauche( courriel , nom , prenom , profession , dateNaissance ) {
    if ( this._telephone === undefined ) {
      this._telephone = this.tabInf['telephone'];
    }
         this.memb.updateInfoMembre(this.memb.membreUpdateInfConj(this.uid, courriel , nom, prenom, profession, this._telephone,
           dateNaissance, this._membre));
      this.fuillet.emit('enr-personnels');
  }
  droite( courriel , nom , prenom , profession , dateNaissance ) {
    if ( this._telephone === undefined ) {
      this._telephone = this.tabInf['telephone'];
    }
    console.log('conjouin', this._membre);
    this.memb.updateInfoMembre(this.memb.membreUpdateInfConj(this.uid, courriel , nom, prenom, profession, this._telephone,
      dateNaissance, this._membre));
    this.fuillet.emit('enr-permissions');
  }

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
