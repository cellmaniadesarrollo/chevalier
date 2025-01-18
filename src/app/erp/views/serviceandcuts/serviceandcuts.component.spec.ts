import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceandcutsComponent } from './serviceandcuts.component';

describe('ServiceandcutsComponent', () => {
  let component: ServiceandcutsComponent;
  let fixture: ComponentFixture<ServiceandcutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceandcutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceandcutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
