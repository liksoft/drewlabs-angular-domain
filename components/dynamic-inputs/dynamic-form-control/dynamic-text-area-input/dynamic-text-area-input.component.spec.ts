import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynamicTextAreaInputComponent } from './dynamic-text-area-input.component';

describe('DynamicTextAreaInputComponent', () => {
  // let component: DynamicTextAreaInputComponent;
  // let fixture: ComponentFixture<DynamicTextAreaInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicTextAreaInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(DynamicTextAreaInputComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
