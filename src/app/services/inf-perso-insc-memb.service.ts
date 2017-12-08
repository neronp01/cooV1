import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../services/auth-service';
import 'rxjs/add/operator/switchMap';

export interface Membre {
  id?: string;
  infFacturation?: Array<any>
  estMembreActif?: boolean;
  courriel?: string;
  nom?: string;
  prenom?: string;
  adresse?: string;  // Référence à une autre interface
  ville?: string;
  codePostal?: string;
  telephone?: string;
  profession?: string;
  dateNaissance?: string;
  typeCotisation?: string,
  courrielConjouint?: string;
  teleList?: boolean;
  nomListe?: boolean;
  animExc?: boolean;
  recenNoel?: boolean;
  animKio?: boolean;
  consAdm?: boolean;
  redacRevi?: boolean;
  promoPubli?: boolean;
  autre?: string;
}

// typeCotisation
export interface MembreId {
  id: string,
  data: Membre
}
export interface MembresId extends Membre {
  id: string,
}

export interface Item {
  id: string,
  name: string;
}

@Injectable()
export class InfPersoInscMembService {
  memberX$: BehaviorSubject<Membre>;
  membre: Membre;
  courriel$: BehaviorSubject<string|null>;
  membreDoc:  AngularFirestoreDocument<MembreId>;
  membresCollection: AngularFirestoreCollection<Membre>
  membres: Observable<Membre[]>;
  membreId: Observable<Membre[]>;
  _membre: Observable<Membre[]>;
  uid: string;
  dataMembre: Membre;
  tabMembres: Array<Membre> = [];
  private shirtCollection: AngularFirestoreCollection<Membre>;
  _membres: Observable<Membre[]>;
  constructor(private db: AngularFireDatabase, private dbc: AngularFirestore, private se: AuthService) {
    this.membres = dbc.collection('membres').valueChanges();
  //  this.memberX$ = new BehaviorSubject(this._membre);
  }
test1() {
  this.shirtCollection = this.dbc.collection<Membre>('membres/');

  // .snapshotChanges() returns a DocumentChangeAction[], which contains
  // a lot of information about "what happened" with each change. If you want to
  // get the data and the id use the map operator.
  this._membres = this.shirtCollection.snapshotChanges().map(actions => {
    return actions.map(a => {
      const data = a.payload.doc.data() as Membre;
      const id = a.payload.doc.id;
      this.tabMembres.push(data);
     // console.log('test', id , data, data.id )
      if ( data.id === this.se.currentUserEmail) {
        this.dataMembre = data;
        this.uid = id}
      return { id, ...data };
    });
  });
  this._membres.subscribe( x =>
    {
   //   console.log('snapshot', this.uid);
    }
  )

}

  tabInfMembre(courriel: string|null) {
  this.courriel$.next(courriel);
  }
  get getDataConjouint(): Membre {
    let conjouint = {}
    this.tabMembres.forEach(x => {
      if (x.courriel === this.dataMembre.courrielConjouint) {
        conjouint = x; }
    })
    return conjouint;
  }
 get membreInitialisation(): Membre {
   const newMembre = { id: this.uid , infFacturation: [] , courriel : '' , prenom : '' , nom : '' , adresse : '' , codePostal : '',
   ville: '' , dateNaissance : '' , profession : '' , telephone : '' , teleList : true , nomListe : true ,
   promoPubli : false , redacRevi : false , recenNoel : false , consAdm : false , animKio : false , typeCotisation: '',
     animExc : false , estMembreActif : false , autre : '' , courrielConjouint: ''}
     return newMembre;
}
ajouterMembre(id: string , courriel: string , nom: string , prenom: string , adresse: string, codePostal: string,
              ville: string, profession: string , telephone: string ,
              dateNaissance: string, typeCotisation: string): Membre {
  const newMembre = { id: id , infFacturation: [] , courriel : courriel , prenom : prenom , nom : nom , adresse : adresse , codePostal : codePostal,
    ville: ville , dateNaissance : dateNaissance , profession : profession , telephone : telephone , teleList : true , nomListe : true ,
    promoPubli : false , redacRevi : false , recenNoel : false , consAdm : false , animKio : false , typeCotisation: typeCotisation,
    animExc : false , estMembreActif : false , autre : '' , courrielConjouint: ''}
  return newMembre;
}
  membreInitialisationConjouint(id: string, courriel: string, courrielConjouint: string ): Membre {
    const newMembre = { id: id , infFacturation: [] , courriel : courriel , prenom : '' , nom : '' , adresse : '' , codePostal : '',
      ville: '' , dateNaissance : '' , profession : '' , telephone : '' , teleList : true , nomListe : true ,
      promoPubli : false , redacRevi : false , recenNoel : false , consAdm : false , animKio : false , typeCotisation: '',
      animExc : false , estMembreActif : false , autre : '' , courrielConjouint: courrielConjouint}
    return newMembre;
  }
  membreUpdateInfConj(id: string , courriel: string , nom: string , prenom: string , profession: string , telephone: string ,
                      dateNaissance: string, membre: Membre ): Membre {
    const upMembre = { id: id , infFacturation: [] , courriel : courriel ,
      prenom : prenom , nom : nom , adresse : membre['adresse'] , codePostal : membre['codePostal'] ,
      ville: membre['ville'] , dateNaissance : dateNaissance , profession : profession , telephone : telephone , typeCotisation: '',
      courrielConjouint: membre['courriel']}
    return upMembre;
  }

membreUpdateInfPerso(prenom: string, nom: string , adresse: string , codePostal: string , ville: string ,
             telephone: string , profession: string, dateNaissance: string, typeCotisation: string, membre: Membre): Membre {
  const upMembre = {
    id: this.uid , infFacturation: [] , courriel : this.se.currentUserEmail , prenom : prenom , nom : nom ,
    adresse : adresse , codePostal : codePostal, ville: ville , dateNaissance : dateNaissance ,
    profession : profession , telephone : telephone, typeCotisation: typeCotisation, teleList : true , nomListe : true ,
    promoPubli : membre.promoPubli , redacRevi : membre.redacRevi , recenNoel : membre.recenNoel , consAdm : membre.consAdm , animKio : membre.animKio ,
    animExc : membre.animExc , estMembreActif : membre.estMembreActif , autre : membre.autre}
  return upMembre;
}

  membreUpdateInfFacture( membre: Membre ): Membre {
    const upMembre = {
      id: membre.id , infFacturation: membre.infFacturation , courriel : membre.courriel , prenom : membre.prenom , nom : membre.nom ,
      adresse : membre.adresse , codePostal : membre.codePostal, ville: membre.ville , dateNaissance : membre.dateNaissance ,
      profession : membre.profession , telephone : membre.telephone, typeCotisation: membre.typeCotisation, teleList : membre.teleList , nomListe : membre.nomListe ,
      promoPubli : membre.promoPubli , redacRevi : membre.redacRevi , recenNoel : membre.recenNoel , consAdm : membre.consAdm , animKio : membre.animKio ,
      animExc : membre.animExc , estMembreActif : true , autre : membre.autre}
    return upMembre;
  }

  membreUpdateInfPermission( teleList: boolean, nomList: boolean, animExc: boolean, recenNoel: boolean , animKio: boolean , consAdm: boolean ,
                             redacRevi: boolean , promoPubli: boolean , autre: string , membre: Membre, id: string ): Membre {
    const upMembre = {
      id: id , infFacturation: membre.infFacturation , courriel : membre.courriel , prenom : membre.prenom , nom : membre.nom ,
      adresse : membre.adresse , codePostal : membre.codePostal, ville: membre.ville , dateNaissance : membre.dateNaissance ,
      profession : membre.profession , telephone : membre.telephone, typeCotisation: membre.typeCotisation, teleList : teleList , nomListe : nomList ,
      promoPubli : promoPubli , redacRevi : redacRevi , recenNoel : recenNoel , consAdm : consAdm , animKio : animKio ,
      animExc : animExc , estMembreActif : membre.estMembreActif , autre : autre}
    return upMembre;
  }

  membreUpdateInfPersoConj(courriel): Membre {
    const upMembre = { courrielConjouint: courriel}
    return upMembre;
  }


  get listeMembre(): Observable<Membre[]> {
    let membre = new Observable<Membre[]>();
    this.membresCollection = this.dbc.collection('membres');
    this.membres = this.membresCollection.valueChanges();
    return membre = this.membres;
  }
 infoMembre(courriel: string): Observable<Membre[]> {
    let membre = new Observable<Membre[]>();
    this.membresCollection = this.dbc.collection('membres', ref => {
        return ref.where('id' , '==', courriel);
    });
   // this.uid = this.membresCollection.ref.doc().id;
    this.membres = this.membresCollection.valueChanges();
    return membre = this.membres;
  }
  infoMembre2(courriel: string): Observable<Membre[]> {
    let membre = new Observable<Membre[]>();
    this.membresCollection = this.dbc.collection('membres', ref => {
      return ref.where('id' , '==', courriel);
    });
    // this.uid = this.membresCollection.ref.doc().id;
    this.membres = this.membresCollection.valueChanges();
    return membre = this.membres;
  }
  // get infoMembreConjouint(): Observable<Membre[]> {
  //   console.log(this.se.currentUserEmail);
  //   let membre = new Observable<Membre[]>();
  //   this.membresCollection = this.dbc.collection('membres', ref => {
  //     return ref.where('id', '==', this.se.currentUserEmail)
  //   });
  //   this.membres = this.membresCollection.valueChanges();
  //   return membre = this.membres;
  // }
  updateInfoMembre( dataMembre: Membre) {
    const id = dataMembre.courriel;
    const data = dataMembre;
    console.log(dataMembre);
    const item: MembreId = { id, data };
    this.membreDoc = this.dbc.doc<MembreId>('membres/' + dataMembre.id);
    console.log(id, dataMembre.id, 'item', item );
    this.membreDoc.update(item)
  }

  addInfoMembre() {
    const id = this.se.currentUserEmail;
    const data = this.membreInitialisation;
    const item: MembreId = { id, data };
    this.membresCollection = this.dbc.collection('membres/');
    this.membresCollection.add(item);
  }
  addInfoMembreNext(membre: Membre) {
    const id = membre.id;
    const data = membre;
    const item: MembreId = { id, data };
    this.membresCollection = this.dbc.collection('membres/');
    this.membresCollection.add(item);
  }

  addInfoMembreConjouint(membre: Membre) {
    const id = membre.courriel;
    const data = membre;
    const item: MembreId = { id, data };
    this.membresCollection = this.dbc.collection('membres/');
    this.membresCollection.add(item);
  }
trouverMembre(s: string ){
    console.log('courriel', s );
    this.membresCollection = this.dbc.collection('membres', ref => {
      return ref.where('id', '==', s)
    });
    this._membre = new Observable<Membre[]>();
    this._membre =  this.membresCollection.valueChanges();
  }

  aUnConjouint(courriel: string): Observable<Membre[]> {

  let tabmembre: Observable<Membre[]>;
    this.membresCollection = this.dbc.collection('membres', ref => {
      return ref.where('data.courrielConjouint', '==', courriel)
    });
    tabmembre =  this.membresCollection.valueChanges();
    console.log('check', courriel , tabmembre);
    return tabmembre;
  }
  trouverUidConj(courriel: string): AngularFirestoreCollection<Membre> {
  let tabMembre: AngularFirestoreCollection<Membre>;
    this.membresCollection = this.dbc.collection('membres', ref => {
      return ref.where('data.courrielConjouint', '==', courriel)
    });
    tabMembre = this.membresCollection;
    return tabMembre;
}

  trouverUid(courriel: string): AngularFirestoreCollection<Membre> {
    let tabMembre: AngularFirestoreCollection<Membre>;
    this.membresCollection = this.dbc.collection('membres', ref => {
      return ref.where('data.courriel', '==', courriel)
    });
    tabMembre = this.membresCollection;
    return tabMembre;
  }

  trouverInfMembre(courriel: string): Observable<Membre[]> {
    let tabmembre: Observable<Membre[]>;
    this.membresCollection = this.dbc.collection('membres', ref => {
      return ref.where('data.courriel', '==', courriel)
    });
    tabmembre =  this.membresCollection.valueChanges();
    return tabmembre;
  }
}
