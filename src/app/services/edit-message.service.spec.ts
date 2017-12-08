import { TestBed, inject } from '@angular/core/testing';

import { EditMessageService } from './edit-message.service';

describe('EditMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditMessageService]
    });
  });

  it('should be created', inject([EditMessageService], (service: EditMessageService) => {
    expect(service).toBeTruthy();
  }));
});
