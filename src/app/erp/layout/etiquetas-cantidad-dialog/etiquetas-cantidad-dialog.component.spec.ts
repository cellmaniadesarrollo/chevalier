import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetasCantidadDialogComponent } from './etiquetas-cantidad-dialog.component';

describe('EtiquetasCantidadDialogComponent', () => {
  let component: EtiquetasCantidadDialogComponent;
  let fixture: ComponentFixture<EtiquetasCantidadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtiquetasCantidadDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtiquetasCantidadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
