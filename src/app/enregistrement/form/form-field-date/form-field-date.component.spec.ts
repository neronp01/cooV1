import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldDateComponent } from './form-field-date.component';

describe('FormFieldDateComponent', () => {
  let component: FormFieldDateComponent;
  let fixture: ComponentFixture<FormFieldDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFieldDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
