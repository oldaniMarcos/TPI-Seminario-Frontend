import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalsTableComponent } from './withdrawals-table.component';

describe('WithdrawalsTableComponent', () => {
  let component: WithdrawalsTableComponent;
  let fixture: ComponentFixture<WithdrawalsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawalsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
