import { Component, OnInit, Output, EventEmitter, Input  } from '@angular/core';
import { InfPersoInscMembService, Membre } from '../../services/inf-perso-insc-memb.service';
import { AuthService } from '../../services/auth-service';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';
import { InformationService, Information} from '../../services/information.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css'],

})
export class FactureComponent implements OnInit {
  @ Output() fuillet = new EventEmitter<string>();
  infoMembre: Membre;
  nom: string;
  adresse: string;
  courriel: string;
  items: Array<object>
 // don: number;
  fraisPostInt = 0;
  fraisPost;
  typeAbonement: string;
  prixAbonnement: number;
  total: number;
  fraisOrnit: number;
   don = 0;
   holdValue= 0;
   newValue: number;
  rowspan = 7;
  constructor(private memb: InfPersoInscMembService, private se: AuthService, private inf: InformationService) {
  }

  ngOnInit() {
    this.total = 0;
    this.trouverUser();
    this.items = [];
    this.inf.info.subscribe( x => {
      this.prixAbonnements(x);
    });
  }
  onKey(e: any ) {
    this.total -= this.holdValue;
    this.total += Number(e);
    this.holdValue = Number(e);
    this.don = Number(e);
    console.log('total' ,  this.don);
  }
  prixAbonnements(a: Information) {
    if ( this.typeAbonement === 'familiale') {
      this.prixAbonnement = a.cotisationFamiliale;
    } else if ( this.typeAbonement === 'individuelle' ) {
      this.prixAbonnement = a.CotisationIndividuelle;
    } else {
      this.prixAbonnement = a.cotisationOrganisme;
    }
    this.total = this.prixAbonnement;
    this.fraisPost = a.fraisDePosteOrnitaouais;

  }
  get calculFacture(): number {
    return 0;
  }
  trouverUser() {
    let user: Observable<firebase.User>;
    user = this.se.user.map(
      x => {
        return x;
      }
    );
    user.subscribe(x => {
      this.trouverInfMembre(x.email);
      this.courriel = x.email;
      // this.trouverUid(x.email);
      console.log('email', x.email)
    });
  }
  trouverInfMembre(courriel: string) {
    this.memb.trouverInfMembre(courriel).subscribe(x => { // this.infoMembre = x[0];
        const data = x[0];
        this.infoMembre = data['data'];
        console.log('lala', this.infoMembre.nomListe);
        this.nom = this.infoMembre.prenom + ' ' + this.infoMembre.nom;
        this.adresse = this.infoMembre.adresse + ' ' + this.infoMembre.ville + ' ' + this.infoMembre.codePostal;
        this.typeAbonement = this.infoMembre.typeCotisation;
      }
    )
  }

  addFraiOrnitouais(e) {
    if (e.checked) {
      this.rowspan += 2;
      this.fraisPostInt = this.fraisPost;
      this.total += this.fraisPostInt;
    } else {
      this.rowspan -= 2;
      this.total -= this.fraisPostInt;
      this.fraisPostInt = 0;
    }
  }
  payment() {
    this.memb.updateInfoMembre(this.memb.membreUpdateInfFacture(this.infoMembre));
  }
}
