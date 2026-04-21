import { TestBed } from '@angular/core/testing';

import { Proprietario } from './proprietario';

describe('Proprietario', () => {
  let service: Proprietario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Proprietario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
