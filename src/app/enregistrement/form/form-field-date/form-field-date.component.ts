import { Component, OnInit, Output, EventEmitter, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { FormGroup,  FormBuilder} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {MatFormFieldControl} from '@angular/material/form-field';
import {FocusMonitor} from '@angular/cdk/a11y';
import {Subject} from 'rxjs/Subject';

export class MyDate {
  constructor(public area: string, public exchange: string, public subscriber: string) {}
}

@Component({
  selector: 'app-form-field-date',
  templateUrl: './form-field-date.component.html',
  styleUrls: ['./form-field-date.component.css']
})

export class FormFieldDateComponent implements MatFormFieldControl<MyDate>, OnDestroy {
static nextId = 0;

@ Input() tabInf: object;
  partsDate: FormGroup;

  stateChanges = new Subject<void>();
  valuesArea= '';
  valuesExchange= '';
  valuesSubscriber= '';
  focused = false;

  ngControl = null;

  errorState = false;

  controlType = 'my-tel-input';

  get empty() {
    const n = this.partsDate.value;
    return !n.area && !n.exchange && !n.subscriber;
  }

  get shouldPlaceholderFloat() {
    return this.focused || !this.empty;
  }

  id = `my-tel-input-${FormFieldDateComponent.nextId++}`;

  describedBy = '';
@ Output() telephone = new EventEmitter<string>();
@Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
private _placeholder: string;

@Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
private _required = false;

@Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
private _disabled = false;

@Input()
  get value(): MyDate | null {
    const n = this.partsDate.value;
    if (n.area.length === 3 && n.exchange.length === 3 && n.subscriber.length === 4) {
      return new MyDate(n.area, n.exchange, n.subscriber);
    }
    return null;
  }
  set value(tel: MyDate | null) {
    tel = tel || new MyDate('', '', '');
    this.partsDate.setValue({area: tel.area, exchange: tel.exchange, subscriber: tel.subscriber});
    this.stateChanges.next();
  }

  constructor(fb: FormBuilder, private fm: FocusMonitor, private elRef: ElementRef,
    renderer: Renderer2) {
    this.partsDate =  fb.group({
      'area': '',
      'exchange': '',
      'subscriber': '',
    });

    fm.monitor(elRef.nativeElement, renderer, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
      console.log(event);
    }
  }
  onKeyArea(event: any, exchange: string, subscriber: string) {
    this.valuesArea = event.target.value;
    this.telephone.emit(this.valuesArea + exchange + subscriber);
  }
  onKeyExchange(area: string, event: any, subscriber: string) {
    this.valuesExchange = event.target.value;
    this.telephone.emit(area + this.valuesExchange + subscriber);
  }

  onKeySubscriber(area: string, exchange: string, event: any) {
    this.valuesSubscriber = event.target.value;
    this.telephone.emit(area + exchange + this.valuesSubscriber);
  }
}

