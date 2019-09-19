import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedRidesPage } from './completed-rides.page';

describe('CompletedRidesPage', () => {
  let component: CompletedRidesPage;
  let fixture: ComponentFixture<CompletedRidesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedRidesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedRidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
