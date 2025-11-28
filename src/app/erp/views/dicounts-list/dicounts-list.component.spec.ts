import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DicountsListComponent } from './dicounts-list.component';

describe('DicountsListComponent', () => {
  let component: DicountsListComponent;
  let fixture: ComponentFixture<DicountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DicountsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DicountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
