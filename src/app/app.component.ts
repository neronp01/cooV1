import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { FormGroup,  FormBuilder,  Validators, FormControl } from '@angular/forms';


interface Membre {
  infFacturation: Array<any>
  estMembreActif: boolean;
  nom: string;
  prenom: string;
  adresse: string;  // Référence à une autre interface
  ville: string;
  codePostal: string;
  telephone: string;
  proffession?: string;
  dateNaissance?: Date;
  abonnementFam: boolean,
  courrielConjouint?: string;
  teleListe: boolean;
  nomListe: boolean;
  animExc: boolean;
  recenNoel: boolean;
  animKio: boolean;
  consAdm: boolean;
  redacRevi: boolean;
  promoPubli: boolean;
  autre?: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  membresCollection: AngularFirestoreCollection<Membre>
  membres: Observable<Membre[]>;
  constructor() {
  //  this.membres = db.collection('membres').valueChanges();
  }

  ngOnInit(){
    // this.membresCollection = this.db.collection('membres', ref => {
    //   return ref.where('prenom', '==', 'Allo')
    // });
    // this.membres = this.membresCollection.valueChanges();
    // this.membres.subscribe(x => console.log(x[0])
    // )

  }
}
