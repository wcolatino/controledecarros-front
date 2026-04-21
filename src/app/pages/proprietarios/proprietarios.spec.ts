import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Proprietarios } from './proprietarios';

describe('Proprietarios', () => {
  let component: Proprietarios;
  let fixture: ComponentFixture<Proprietarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proprietarios],
    }).compileComponents();

    fixture = TestBed.createComponent(Proprietarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
