// https://gist.github.com/bentedder/136fa7670a8a23617f91be4f9566f96b#file-calendar-component-scss

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { EditMessageService} from './../../services/edit-message.service';

export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
}

@Component({
  selector: 'yoshimi-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [ EditMessageService ]
})
export class CalendarComponent implements OnInit, OnChanges {

  currentDate = moment().locale('fr');
  dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  topleft = 'hidden';
  _listeMessage = [];

  @Input() selectedDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();

  constructor(private ed: EditMessageService) {}

  ngOnInit(): void {
    this.listeMessage();
    this.generateCalendar();
  }

  listeMessage() {
    console.log(' allo ');
    this.ed.listeEditMessage.subscribe( x => {
      x.forEach( y => {
      const temp = y['data'];
      const couleur = temp['couleur'];
      const act = temp['titre'];
      const date = temp['date'];
      const mDay = moment(date).format('DD');
      const mMois = moment().isSame(moment(date), 'day');
      const lieu = temp['adresse'];
      const init = temp['editeur'];
      const lect = temp['lecteur'];
      const message = temp['texte'];
      this._listeMessage.push({ couleur: couleur, activite: act, date: mDay, dateMois: mMois, lieu: lieu , init: init , lect: lect , texte: message});
        console.log('lieu' , lieu, ' init: ' , init, 'lect: ' , lect, 'message: ', message);
      });

        console.log( 'x' , this._listeMessage );
      }
    )
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDates &&
      changes.selectedDates.currentValue &&
      changes.selectedDates.currentValue.length  > 1) {
      // sort on date changes for better performance when range checking
      this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
      this.generateCalendar();
    }
  }

  // date checkers
  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate): void {
    this.onSelectDate.emit(date);
  }

  // actions from calendar
  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  firstMonth(): void {
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
  }

  prevYear(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'year');
    this.generateCalendar();
  }

  nextYear(): void {
    this.currentDate = moment(this.currentDate).add(1, 'year');
    this.generateCalendar();
  }

  // generate the calendar grid
  generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  isActivityDay(e: any): boolean {
    let rep: boolean;
    rep = false;
    // this._listeMessage.forEach( x => {
    //   console.log('e' , e , x['date']);
    //   if (x['date'] === e) {
    //     rep = true;
    //   }
    // })
    return rep;
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          selected: this.isSelected(d),
          mDate: d,
        };
      });
  }
}
