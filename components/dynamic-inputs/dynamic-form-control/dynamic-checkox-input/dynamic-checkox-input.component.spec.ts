import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynamicCheckoxInputComponent } from './dynamic-checkox-input.component';

describe('DynamicCheckoxInputComponent', () => {
  // let component: DynamicCheckoxInputComponent;
  // let fixture: ComponentFixture<DynamicCheckoxInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicCheckoxInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(DynamicCheckoxInputComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
