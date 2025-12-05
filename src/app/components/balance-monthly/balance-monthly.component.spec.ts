import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceMonthlyComponent } from './balance-monthly.component';

describe('BalanceMonthlyComponent', () => {
  let component: BalanceMonthlyComponent;
  let fixture: ComponentFixture<BalanceMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceMonthlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
