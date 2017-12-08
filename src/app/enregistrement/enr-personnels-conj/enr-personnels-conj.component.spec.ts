import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrPersonnelsConjComponent } from './enr-personnels-conj.component';

describe('EnrPersonnelsConjComponent', () => {
  let component: EnrPersonnelsConjComponent;
  let fixture: ComponentFixture<EnrPersonnelsConjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrPersonnelsConjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrPersonnelsConjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
