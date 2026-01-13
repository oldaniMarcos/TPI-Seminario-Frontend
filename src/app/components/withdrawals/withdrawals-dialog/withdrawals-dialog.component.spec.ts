import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalsDialogComponent } from './withdrawals-dialog.component';

describe('WithdrawalsDialogComponent', () => {
  let component: WithdrawalsDialogComponent;
  let fixture: ComponentFixture<WithdrawalsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
