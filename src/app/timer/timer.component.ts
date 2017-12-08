import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  @ Input() parent: string;
  x = 50;
seconde = 300;
  ajoutTemps = 0;
tempsRestent: number;
  ticks = 0;
message = 'allo';
messages = 'Introduction';
stripe = false;
sousMessage = '';
  minutesDisplay: number = 0;
  hoursDisplay: number = 0;
  secondsDisplay: number = 0;
  timerSeconde = 60;
  COOInfo = ['Le plus vieux club du Québec', 'Protection des oiseaux et de leurs habitats' , 'Plus de 300 membres', 'Des amoureux des oiseaux',
    'Moyenne d’âge plus élevé' , 'Écologistes', 'Réseau social'];
  COOINFBOOL = false;
  objectifInfo = ['Objectifs', 'Automatisation des tâches' , 'Développer un système modulaire '];
  objectBool = false;
  techno = false;
  oauth = false;
  sub: Subscription;

  ngOnInit() {
    this.startTimer();
  }

  private startTimer() {
    this.tempsRestent = this.seconde;

    let timer = Observable.timer(1, 1000);
    this.sub = timer.subscribe(
      t => {
        this.ticks = t;

        this.secondsDisplay = this.getSeconds(this.ticks);
        this.minutesDisplay = this.getMinutes(this.ticks);
        this.hoursDisplay = this.getHours(this.ticks);
       // console.log( 's' , this.secondsDisplay, 'm' , this.minutesDisplay);
        console.log( 'x' , this.tempsRestent, t);

        if ( this.parent === 'enr') {
          if ( t === 140 ) {
            this.stripe = true;
          }
          if ( t === 60 ) {
            this.message = 'Facture'
          } else if ( t === 0) {
            this.message = 'Inscription';
            this.sousMessage = 'Formulaires';
            this.seconde = 180;
            this.ajoutTemps = -120;
          }
        } else if (this. parent === 'login') {
          if (t === 300) {
            this.message = 'Technologie';
            this.seconde = 660;
            this.x = 50;
            this.objectBool = false;
            this.ajoutTemps = 300;
          }
          else if (t === 0) {
            this.message = 'Introduction'
          }
        } else {
          this.message = 'Application'
          this.seconde = 360;
        }
      }
    );
  }

  private getSeconds(ticks: number) {

    const temp = (360 + this.ajoutTemps) / this.seconde;
    this.x += temp;
    console.log(temp, this.x);
    const test = this.seconde - ticks;
    if (this.parent === 'login') {
      if (this.message === 'Introduction') {
        if (test < 240) {
          if (test > 120) {
            this.sousMessage = 'Qu\'est-ce que le COO';
            this.COOINFBOOL = true;
          } else if (test > 60) {
            this.sousMessage = 'La genêse du projet';
          } else {
            this.COOINFBOOL = false;
            this.sousMessage = 'Objectifs';
            this.objectBool = true;

          }
        }
      }
      if (this.message === 'Technologie') {
        if (test > 120) {
          this.techno = true;
          this.sousMessage = 'Les platformes';
        } else {
          this.techno = false;
          this.sousMessage = 'Le système d\'authentification';
          this.oauth = true;
        }
      }
    }
    return this.pad(test % 60);
  }

  private getMinutes(ticks: number) {
    const test = this.seconde - ticks;
    return this.pad((Math.floor(test / 60)) % 60);
  }

  private getHours(ticks: number) {
    return this.pad(Math.floor((ticks / 60) / 60));
  }

  private pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }
}

