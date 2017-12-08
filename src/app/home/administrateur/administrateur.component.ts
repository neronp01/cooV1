import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { InformationService } from '../../services/information.service';
import { NoteService } from '../../services/note.service';
import { DbService} from '../../services/db.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';
import * as moment from 'moment';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-administrateur',
  templateUrl: './administrateur.component.html',
  styleUrls: ['./administrateur.component.css'],
  providers: [InformationService , NoteService, DbService]
})

export class AdministrateurComponent implements OnInit {
@ Input () etat: string;
@ Output () closeAdmin = new EventEmitter<string>();
tabRolePerso: Array<string>;
courriel: string;
etatEdit: string;
tabTempRole: Array<number>;
tabRoleOrg: object;
listeRolePasInscrit: Array<string>;
listeRoleOrg: Array<string>;
selectedValueRole: string;
listeNote: Array<object>;
selectedValueRoleOrg: string;
inputValue = '';


  constructor( private inf: InformationService, private note: NoteService, private dbs: DbService) { }

  ngOnInit() {
    this.etatEdit = 'edit';
    this.tabRoleOrg = {};
    this.inf.infoRole.subscribe( x => {
     this.tabRoleOrg = x;
    });
    this.listeOrgRole();
  }
getNoteListe(courriel: string) {
    this.note.listeNotes(courriel).subscribe( x => {
      this.listeNote = [];
      const temp = x.forEach( y => {
        this.listeNote.push({date:  moment(y['date']).locale('fr').format('MM-DD-YYYY'), texte: y['texte']})
      });
      console.log(' NOTE' , this.listeNote)
    })
}
  listeOrgRole() {
    this.inf.infoRole.subscribe( x => {
      this.tabRoleOrg = x;
      this.listeRoleOrg = [];
      x['tabRole'].forEach(y => {
        this.listeRoleOrg.push(y);
      });
    });
  }
  listeUserRole() {
    this.listeRolePasInscrit = [];
    let addRoleInList: boolean;
    this.tabRoleOrg['tabRole'].forEach( x => {
      addRoleInList = true;
      this.tabRolePerso.forEach( y => {
        if (x === y) {
          addRoleInList = false;
        }
          });
      if ( addRoleInList ) {
        this.listeRolePasInscrit.push(x);
      }
    });
  }
  trouverRole() {
    this.tabTempRole = [];
    this.tabRolePerso = [];
    this.inf.infoRole.subscribe( x => {

      const temp = x['tabRole'];
      temp.forEach( y => {
        const temp2 = x[y];
        temp2.forEach( q => {
          if (this.courriel === q) {
            this.tabRolePerso.push(y);
          }
        });
      });
      this.listeUserRole();
    })
  }
  adminEditMemb(e: any) {
 this.courriel = e[1];
 this.etatEdit = e[0];
    this.trouverRole();
    this.getNoteListe(e[1]);
  }
  closeWindows(e: string) {
    this.etatEdit = e;
  }
  ajouterMembreClick() {
    this.etatEdit = 'ajouterMembre';
  }

  closeClick() {
    this.etatEdit = '';
  }
  roleOption(e: any) {
    console.log( 'role' , e);
    let temp: boolean;
    temp = true;
    this.tabTempRole.forEach( x => {
      if ( x === e) {
        temp = false;
        const index = this.tabTempRole.indexOf(e);
        if (index > -1) {
          this.tabTempRole.splice(index, 1);
        }
      }
    });
  if ( temp ) {
    this.tabTempRole.push(e)
  }
  }
  saveRoleClick() {
    const lenght = this.tabRolePerso.length;
    let tabTemp: Array<string>;
    let i: number;
      this.tabTempRole.forEach( y => {
        for ( i = 0 ; i < lenght ; i++) {
          if ( i === y ) {
            let temp: Array<Array<string>>;
            temp = [];
            tabTemp = [];
            temp.push(this.tabRoleOrg[this.tabRolePerso[y]]);
            console.log('c ' , this.tabRoleOrg)
            temp.forEach( x => {
              x.forEach( y => {
                if ( y !== this.courriel) {
                  tabTemp.push(y);
                }
              });
              });
            }}
      this.tabRoleOrg[this.tabRolePerso[y]] = tabTemp;
      });
      if ( this.selectedValueRole !== undefined) {
        this.tabRoleOrg[this.selectedValueRole].push(this.courriel);
      }
      this.inf.updateRole(this.tabRoleOrg);
    this.etatEdit = '';
  }
  saveRoleOrgClick(newRole : string) {
    let liste: Array<string>;
    liste = [];
    let obj: object;
    obj = {}
    let count: number;
    let tabTemp: Array<string>;
    count = 0;
 this.listeRoleOrg.forEach( x => {

   let isDel: boolean;
   isDel = true;
   this.tabTempRole.forEach( y => {
     console.log(count , 'y' , y);
     if (count === y) {

       isDel = false;
     }
   });
   console.log('xxx' , x , isDel)
   if (isDel) {
     const tab = this.tabRoleOrg[x];
     liste.push(x);
     obj[x] = tab;
   }
   count++;
 });
 if (newRole !== undefined) {
   liste.push(newRole);
   obj[newRole] = [];
 }
    obj['tabRole'] = liste;
    this.inf.updateRole(obj);
    this.etatEdit = '';
  }
  gestionRoleClick() {
    this.tabTempRole = [];
    this.etatEdit = 'gestionRole';
  }
  addNoteClick(note: string) {
    let obj: object;
    obj = {};
    obj['date'] = Date.now();
    obj['id'] = this.courriel;
    obj['texte'] = note;
    this.note.addNote(obj);
    this.inputValue = '';
  //  this.getNoteListe(this.courriel);
  }
  removeClick(e: number) {
    const temp = this.listeNote[e];
    this.dbs.getUid('notesMembres', temp['texte'], 'texte').subscribe( x => {
      console.log('ob' , x)
      }
    );
  }
  retourHomeClick() {
    this.closeAdmin.emit('liste');
  }
}


