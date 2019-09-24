import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtedPage } from './exted.page';

describe('ExtedPage', () => {
  let component: ExtedPage;
  let fixture: ComponentFixture<ExtedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
