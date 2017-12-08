import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { InfPersoInscMembService } from '../../../services/inf-perso-insc-memb.service';
import { EditMessageService} from '../../../services/edit-message.service';
import { CalendarDate } from './../calendar.component'

@Component({
  selector: 'app-edit-message',
  templateUrl: './edit-message.component.html',
  styleUrls: ['./edit-message.component.css'],
  providers: [ EditMessageService ]
})

export class EditMessageComponent implements OnInit {
@ Output()contenusMessage = new EventEmitter<object>();
@ Input()dateMessage: CalendarDate;
  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  states: any[];
  colors: string;
  date = new FormControl(new Date());

  constructor( private memb: InfPersoInscMembService , private ed: EditMessageService) {
    this.stateCtrl = new FormControl();
  }
  ngOnInit() {
   // this.date = this.dateMessage.mDate.locale('fr').format('ll');

    this.states = [];
    this.memb.listeMembre.subscribe( x => {

      x.forEach( y => {
        const temp = y['data'];
        console.log('super_x' , temp.nom );
        this.states.push(temp.prenom + ' ' + temp.nom);
      });
      this.stateCtrl = new FormControl();
      this.filteredStates = this.stateCtrl.valueChanges
        .startWith(null)
        .map(state => state ? this.filterStates(state) : this.states.slice());
    })
  }
  filterStates(name: string) {
    return this.states.filter(state =>
      state.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  sauverMessageClick( titre: string, date: Date, lecteur: string, adresse: string, texte: string ) {
      this.ed.addMessage({titre: titre, date: date, couleur: this.colors, lecteur: lecteur, adresse: adresse, texte: texte});
      this.contenusMessage.emit({fenetre: 'calendar'});
  }
  closeClick() {
    this.contenusMessage.emit({fenetre: 'calendar'});
  }
}
