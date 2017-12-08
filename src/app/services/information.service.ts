import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../services/auth-service';
import 'rxjs/add/operator/switchMap';

export interface Information {
  CotisationIndividuelle ?: number;
  calendrier ?: number;
  cotisationFamiliale ?: number;
  cotisationOrganisme ?: number;
  fraisDePosteOrnitaouais ?: number;
  fraisEnvoiCalendrier ?: number;
  fraisEnvoiGuide ?: number;
  guideDesSites ?: number;
  tps ?: number;
  tvq ?: number;
}

@Injectable()
export class InformationService {
  infoDoc:  AngularFirestoreDocument<object>;
  roleDoc:  AngularFirestoreDocument<object>;

  constructor( private dbc: AngularFirestore) { }

  get info(): Observable<any> {
    let newInfo = new Observable<any>();
    this.infoDoc = this.dbc.doc<object>('informations/prix');
    newInfo = this.infoDoc.valueChanges();
    return newInfo;
  }
  get infoRole(): Observable<any> {
    let newInfo = new Observable<any>();
    this.roleDoc = this.dbc.doc<object>('informations/role');
    return newInfo = this.roleDoc.valueChanges();
  }

  updateRole( role: object) {
    this.roleDoc = this.dbc.doc<object>('informations/role');
    this.roleDoc.update(role)
  }
}
