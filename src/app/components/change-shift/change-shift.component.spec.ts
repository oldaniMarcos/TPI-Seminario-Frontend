import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeShiftComponent } from './change-shift.component';

describe('ChangeShiftComponent', () => {
  let component: ChangeShiftComponent;
  let fixture: ComponentFixture<ChangeShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeShiftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
