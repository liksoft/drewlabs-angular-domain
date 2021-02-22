import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynamicFileInputComponent } from './dynamic-file-input.component';

describe('DynamicFileInputComponent', () => {
  // let component: DynamicFileInputComponent;
  // let fixture: ComponentFixture<DynamicFileInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFileInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(DynamicFileInputComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
