import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynamicRadioInputComponent } from './dynamic-radio-input.component';

describe('DynamicRadioInputComponent', () => {
  // let component: DynamicRadioInputComponent;
  // let fixture: ComponentFixture<DynamicRadioInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicRadioInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(DynamicRadioInputComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
