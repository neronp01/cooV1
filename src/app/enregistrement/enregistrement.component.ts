import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { InfPersoInscMembService, Membre } from '../services/inf-perso-insc-memb.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'app-enregistrement',
  templateUrl: './enregistrement.component.html',
  styleUrls: ['./enregistrement.component.css'],
  providers: [ AuthService, InfPersoInscMembService ]
})

export class EnregistrementComponent implements OnInit {
  fuillet = 'enr-personnels';
  infoMembre: Membre;
  infoMembreConjoint: Membre;
  membreX: BehaviorSubject<Membre>;
  parent = 'enr';
  constructor() {
  }

  ngOnInit() {
  }
  newFuillet(e) {
    console.log(' fuillet' , e);
    this.fuillet = e;
  }
  _infoMembre(e) {
    this.infoMembre = e;
  }
  _infoMembreConjoint(e) {
    this.infoMembreConjoint = e;
  }
  _membreX(e) {
   this.membreX = e
  }
}
