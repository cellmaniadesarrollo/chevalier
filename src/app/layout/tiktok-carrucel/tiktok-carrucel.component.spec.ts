import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiktokCarrucelComponent } from './tiktok-carrucel.component';

describe('TiktokCarrucelComponent', () => {
  let component: TiktokCarrucelComponent;
  let fixture: ComponentFixture<TiktokCarrucelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiktokCarrucelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiktokCarrucelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
