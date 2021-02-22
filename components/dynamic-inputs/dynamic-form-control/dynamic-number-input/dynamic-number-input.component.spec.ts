import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynamicNumberInputComponent } from './dynamic-number-input.component';

describe('DynamicNumberInputComponent', () => {
  // let component: DynamicNumberInputComponent;
  // let fixture: ComponentFixture<DynamicNumberInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicNumberInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(DynamicNumberInputComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
