import { Component, OnInit, Inject } from '@angular/core';
import { InfPersoInscMembService, Membre } from './../services/inf-perso-insc-memb.service';
import { InformationService } from './../services/information.service';
import { AuthService } from './../services/auth-service';
import {Observable} from 'rxjs/Observable';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase';
import { CalendarDate } from './calendar/calendar.component';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [InformationService],
  animations: [
    trigger('infoState', [
      state('inactive', style({
        flex: '1 2%',
        display: 'none',
      })),
      state('active',   style({
        display: 'flex',
        flex: '1 30%',
      })),
      transition('inactive => active', animate('4000ms ease-in')),
      transition('active => inactive', animate('4000ms ease-out'))
    ]),
    trigger('roleState', [
      state('inactive', style({
        flex: '1 2%',
        display: 'none',
        width: '0px'
      })),
      state('active',   style({
        display: '',
        flex: '1 50%',
        width: '500px'
      })),
      transition('inactive => active', animate('4000ms ease-in')),
      transition('active => inactive', animate('4000ms ease-out'))
    ]),
    trigger('listeState', [
      state('inactive', style({
        flex: '1 2%',
        display: 'none',
        width: '0px'
      })),
      state('active',   style({
        display: '',
        flex: '1 60%',
        width: '500px'
      })),
      transition('inactive => active', animate('4000ms ease-in')),
      transition('active => inactive', animate('4000ms ease-out'))
    ])
  ]
})
export class HomeComponent implements OnInit {
  parent = 'home';
  nom: string;
  adresse: string;
  courriel: string;
  _envoieCourriel: string;
  infoMembre: Membre;
  typeAbonement: string;
  liste = [];
  etat = 'liste';
  telephone: string;
  profession?: string;
  dateNaissance?: string;
  typeCotisation?: string;
  courrielConjouint?: string;
  teleList?: boolean;
  nomListe?: boolean;
  animExc?: boolean;
  recenNoel?: boolean;
  animKio?: boolean;
  consAdm?: boolean;
  redacRevi?: boolean;
  promoPubli?: boolean;
  tabRolePerso: Array<string>;
  tabRoleCOO: Array<Array<string>>;
  tabRoleTotal: Array<number>;
  tabRole: Array<string>;
  position = 'above';
  animal: string;
  name: string;
  etatAdmin= 'liste';
  contenusMessage: object;
  calendar= 'calendar';
  editDate: CalendarDate;
  state = 'inactive';
  roleState = 'inactive';
  listeState = 'inactive';
  ville: string;
  codePostal: string;
  constructor(private memb: InfPersoInscMembService, private se: AuthService, private inf: InformationService, public dialog: MatDialog) { }

  ngOnInit() {

    this.trouverUser();

  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '650px',
      data: { courriel: 'neronpascal001@gmail.com', etat: ['overviewEdit',  'neronpascal001@gmail.com'] }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  trouverUser() {
    let user: Observable<firebase.User>;
    user = this.se.user.map(
      x => {
        this.trouverInfMembre(x.email);

        return x;
      }
    );
    user.subscribe(x => {
      this.trouverInfMembre(x.email);
      this.courriel = x.email;
      // this.trouverUid(x.email);
    });
  }

  trouverInfMembre(courriel: string) {
    this.memb.trouverInfMembre(courriel).subscribe(x => { // this.infoMembre = x[0];
        const data = x[0];
        this.infoMembre = data['data'];
        this.nom = this.infoMembre.prenom + ' ' + this.infoMembre.nom;
        this.adresse = this.infoMembre.adresse ;
        this.ville = this.infoMembre.ville;
        this.codePostal = this.infoMembre.codePostal;
        this.typeAbonement = this.infoMembre.typeCotisation;
        this.telephone = '(' + this.infoMembre.telephone.substring(0, 3) + ') ' + this.infoMembre.telephone.substring(3, 6) + '-' + this.infoMembre.telephone.substring(6, 10);
        this.profession = this.infoMembre.profession;
        this.dateNaissance = this.infoMembre.dateNaissance;
      }
    )
  }
  trouverRole() {
    this.tabRolePerso = [];
    this.tabRoleCOO = [];
    this.tabRole = [];
    this.tabRoleTotal = [];
    this.inf.infoRole.subscribe( x => {
      const temp = x['tabRole'];
      temp.forEach( y => {
        let tab: Array<string>;
        let obj: object;
        tab = [];
        obj = {};
        const temp2 = x[y];
        temp2.forEach( q => {
          if (this.courriel === q) {
            this.tabRolePerso.push(y);
          }
          this.memb.trouverInfMembre(q).subscribe( z => {
              if ( z[0] !== undefined) {
              const tabnom = z[0];
              const nom = tabnom['data'];
              tab.push(nom.prenom + ' ' + nom.nom);
            }
          }
          );
        });
        this.tabRole.push(y);
        obj[y] = tab;
        this.tabRoleCOO.push(tab);
      });



    })
  }
  envoieCourriel(e: any) {

    this.etat = e[0];
    this._envoieCourriel = e[1];
  }
  envoie(e: any) {
    this.etat = e;
  }

  logout() {
    this.se.logout();
  }
  onSelectDate(e: any) {

     this.calendar = 'edit';
     this.editDate = e;
  }
  test() {

    this.tabRoleCOO.forEach( a => {

      a.forEach( b => {

      })
   //   this.tabRoleTotal.push(a.length);
    })
  }
  administrateurClick() {
    this.etatAdmin = 'admin';
  }
  selectedTab(a: any) {
    if ( a.index === 3) {
      this.etatAdmin = 'admin';
    } else if (a.index <= 1 ) {
      this.etatAdmin = 'liste';
    } else {
      this.etatAdmin = '';
    }

  }
  _contenusMessage(e: any) {
    this.calendar = e['fenetre'];
  }

sauverMessageClick() {}

  toggleState() {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }
  toggleRoleState() {
    this.trouverRole();
    this.roleState = this.roleState === 'active' ? 'inactive' : 'active';
  }
  togglelisteState() {
    this.listeState = this.listeState === 'active' ? 'inactive' : 'active';
  }
  adminClose( e: any) {
    this.etatAdmin = e;
  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./home.component.css']
})
export class DialogOverviewExampleDialog {
etat= 'overviewEdit';
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {

    this.dialogRef.close();
  }
  closeWindows(e: any) {
    console.log(e);
  }

}
