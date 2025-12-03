import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegiterClientComponent } from './regiter-client.component';

describe('RegiterClientComponent', () => {
  let component: RegiterClientComponent;
  let fixture: ComponentFixture<RegiterClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegiterClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegiterClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
