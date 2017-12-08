import { Component, OnInit, Output, EventEmitter, Input  } from '@angular/core';
import { InfPersoInscMembService, Membre } from '../../services/inf-perso-insc-memb.service';
import { AuthService } from '../../services/auth-service';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';

@Component({
  selector: 'app-enr-permissions',
  templateUrl: './enr-permissions.component.html',
  styleUrls: ['./enr-permissions.component.css'],
  providers: []
})
export class EnrPermissionsComponent implements OnInit {
  @ Output() fuillet = new EventEmitter <string>();
  infoMembre: Membre;
  autorisationTel= true;
  autorisationNom= true;
  _page = '3 / 3';
  uid: string;
  courriel: string;
  _autorisationsTelephone = ['Je ', 'veux ', 'que mon numéro de téléphone figure sur la liste des membres.'];
  _autorisationsNom = ['Je ', 'veux  ', ' que mon nom figure sur la liste des membres.'];
  constructor(private memb: InfPersoInscMembService , private se: AuthService ) {

  }

  ngOnInit() {
 this.trouverUser();
 this.infoMembre = this.memb.membreInitialisation;

  }

trouverUser() {
    let user: Observable<firebase.User>;
  user = this.se.user.map(
    x => { return x; }
  );
  user.subscribe( x => {
    this.trouverInfMembre(x.email);
    this.courriel = x.email;
    this.trouverUid(x.email);

});
}

  trouverInfMembre(courriel: string) {
    this.memb.trouverInfMembre(courriel).subscribe( x =>
      { // this.infoMembre = x[0];
        const data = x[0];
        this.infoMembre = data['data'];

      }
    )
  }

  trouverUid(courriel: string) {

    let trouverUid: Observable<Membre[]>;
    trouverUid = this.memb.trouverUid(courriel).snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Membre;
          const id = a.payload.doc.id;
          this.uid = id;

          this.infoMembre = data['data'];

          return { id, ...data };
        });
      });
    trouverUid.subscribe(
      x => console.log('subscrib', x )
    )
  }

  gauche( teleList, nomList, animExc, recenNoel , animKio , consAdm , redacRevi , promoPubli , autre ) {
    this.memb.updateInfoMembre(this.memb.membreUpdateInfPermission(teleList, nomList, animExc, recenNoel , animKio , consAdm , redacRevi , promoPubli , autre, this.infoMembre, this.uid))
    if ( this.infoMembre['abonnementFam'] === true ) {
      this.fuillet.emit('enr-personnels-conj');
    } else {
      this.fuillet.emit(  'enr-personnels');
    }
  }
  facture( teleList, nomList, animExc, recenNoel , animKio , consAdm , redacRevi , promoPubli , autre ) {
    console.log(teleList, nomList, animExc, recenNoel , animKio , consAdm , redacRevi , promoPubli , autre);
      this.fuillet.emit('facture');
    this.memb.updateInfoMembre(this.memb.membreUpdateInfPermission(teleList, nomList, animExc, recenNoel , animKio , consAdm , redacRevi , promoPubli , autre, this.infoMembre, this.uid))
  }
  autorisationsTelephone(e) {
    if (e.checked === true) {
      this._autorisationsTelephone = ['Je ', 'ne veux pas ', 'que mon numéro de téléphone figure sur la liste des membres.'];
    }else {
      this._autorisationsTelephone = ['Je ', 'veux ', 'que mon numéro de téléphone figure sur la liste des membres.'];
    }
    this.autorisationTel = e;
  }
  autorisationsNom(e) {
    if (e.checked === true) {
      this._autorisationsNom = ['Je ', 'ne veux pas ', 'que mon nom figure sur la liste des membres.'];
    }else {
      this._autorisationsNom = ['Je ', 'veux  ', ' que mon nom figure sur la liste des membres.'];
    }
    this.autorisationNom = e;
  }

}
