import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynamicPasswordInputComponent } from './dynamic-password-input.component';

describe('DynamicPasswordInputComponent', () => {
  // let component: DynamicPasswordInputComponent;
  // let fixture: ComponentFixture<DynamicPasswordInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPasswordInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(DynamicPasswordInputComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
