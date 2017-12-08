import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrPersonnelsComponent } from './enr-personnels.component';

describe('EnrPersonnelsComponent', () => {
  let component: EnrPersonnelsComponent;
  let fixture: ComponentFixture<EnrPersonnelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrPersonnelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrPersonnelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
