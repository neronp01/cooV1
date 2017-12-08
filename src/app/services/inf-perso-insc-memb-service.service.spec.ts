import { TestBed, inject } from '@angular/core/testing';

import { InfPersoInscMembService } from './inf-perso-insc-memb.service';

describe('InfPersoInscMembServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfPersoInscMembService]
    });
  });

  it('should be created', inject([InfPersoInscMembService], (service: InfPersoInscMembService) => {
    expect(service).toBeTruthy();
  }));
});
