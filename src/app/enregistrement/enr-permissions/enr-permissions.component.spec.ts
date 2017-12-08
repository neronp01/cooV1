import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrPermissionsComponent } from './enr-permissions.component';

describe('EnrPermissionsComponent', () => {
  let component: EnrPermissionsComponent;
  let fixture: ComponentFixture<EnrPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
