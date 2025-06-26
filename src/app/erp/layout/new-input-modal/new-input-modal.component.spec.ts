import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInputModalComponent } from './new-input-modal.component';

describe('NewInputModalComponent', () => {
  let component: NewInputModalComponent;
  let fixture: ComponentFixture<NewInputModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewInputModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
