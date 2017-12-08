import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent {

  private static readonly errorMessages = {
    'required': () => 'This field is required',
    // 'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
    // 'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
    // 'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
    // 'years': (params) => params.message,
    // 'countryCity': (params) => params.message,
    // 'uniqueName': (params) => params.message,
    // 'telephoneNumbers': (params) => params.message,
    'dateNaissanceValidation': (params) => params.message
  };

  constructor() { }

  @Input()
  private control: AbstractControlDirective | AbstractControl;

  shouldShowErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
   // console.log('message' , Object.keys(this.control.errors))
    console.log('message' , Object.keys(this.control.errors));
    return  Object.keys(this.control.errors)
      .map(field =>  this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    return ErrorsComponent.errorMessages[type](params);
  }
}
