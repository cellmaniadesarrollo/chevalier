import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicModalInputComponent } from './dynamic-modal-input.component';

describe('DynamicModalInputComponent', () => {
  let component: DynamicModalInputComponent;
  let fixture: ComponentFixture<DynamicModalInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicModalInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicModalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
