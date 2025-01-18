import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrucelwelcomeComponent } from './carrucelwelcome.component';

describe('CarrucelwelcomeComponent', () => {
  let component: CarrucelwelcomeComponent;
  let fixture: ComponentFixture<CarrucelwelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarrucelwelcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrucelwelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
