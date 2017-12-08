import { Directive } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator, ValidationErrors } from '@angular/forms';


@Directive({
  selector: '[dateNaissanceValidation]',
  providers: [{provide: NG_VALIDATORS, useExisting: DateNaissanceValidationDirective, multi: true}]

})
export class DateNaissanceValidationDirective implements Validator {
    validate(c: FormControl): ValidationErrors {
      let isValidDate = false;
      if (c.value !== '') {
        isValidDate = /^\d{2,2}[/]\d{2,2}[/]\d{4,4}$/.test(c.value);
      } else {
        isValidDate = true;
      }
        const message = {
          'dateNaissanceValidation': {
            'message': 'Le format est JJ/MM/AAAA'
          }
        };
      console.log(isValidDate, c.pristine)
      return  isValidDate ? null : message;
    }
}
