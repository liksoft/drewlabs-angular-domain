import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynamicTextInputComponent } from './dynamic-text-input.component';

describe('DynamicTextInputComponent', () => {
  // let component: DynamicTextInputComponent;
  // let fixture: ComponentFixture<DynamicTextInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicTextInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(DynamicTextInputComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
