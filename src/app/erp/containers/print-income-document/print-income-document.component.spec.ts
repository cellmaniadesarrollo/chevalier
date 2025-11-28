import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintIncomeDocumentComponent } from './print-income-document.component';

describe('PrintIncomeDocumentComponent', () => {
  let component: PrintIncomeDocumentComponent;
  let fixture: ComponentFixture<PrintIncomeDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintIncomeDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintIncomeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
