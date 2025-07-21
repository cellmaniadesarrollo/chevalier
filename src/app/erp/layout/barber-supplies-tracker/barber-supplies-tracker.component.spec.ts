import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberSuppliesTrackerComponent } from './barber-supplies-tracker.component';

describe('BarberSuppliesTrackerComponent', () => {
  let component: BarberSuppliesTrackerComponent;
  let fixture: ComponentFixture<BarberSuppliesTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BarberSuppliesTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberSuppliesTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
