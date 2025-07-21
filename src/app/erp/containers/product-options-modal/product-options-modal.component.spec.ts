import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOptionsModalComponent } from './product-options-modal.component';

describe('ProductOptionsModalComponent', () => {
  let component: ProductOptionsModalComponent;
  let fixture: ComponentFixture<ProductOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductOptionsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
