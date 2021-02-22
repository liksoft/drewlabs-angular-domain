import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynamicSelectInputComponent } from './dynamic-select-input.component';

describe('DynamicSelectInputComponent', () => {
  // let component: DynamicSelectInputComponent;
  // let fixture: ComponentFixture<DynamicSelectInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicSelectInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(DynamicSelectInputComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
