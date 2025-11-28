import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiscountModalComponent } from './edit-discount-modal.component';

describe('EditDiscountModalComponent', () => {
  let component: EditDiscountModalComponent;
  let fixture: ComponentFixture<EditDiscountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDiscountModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDiscountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
