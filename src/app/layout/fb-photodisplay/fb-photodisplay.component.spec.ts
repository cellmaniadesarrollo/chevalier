import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbPhotodisplayComponent } from './fb-photodisplay.component';

describe('FbPhotodisplayComponent', () => {
  let component: FbPhotodisplayComponent;
  let fixture: ComponentFixture<FbPhotodisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FbPhotodisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FbPhotodisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
