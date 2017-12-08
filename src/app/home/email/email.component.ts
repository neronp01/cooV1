import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
@ Input () courriel: string;
@ Output () envoie = new EventEmitter <string>();
  constructor() { }

  ngOnInit() {
    console.log('courriel ng');
  }
  envoyerClick() {
     console.log('envoie');
     this.envoie.emit('infoPerso')
  }
}
