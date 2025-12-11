import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesDialogComponent } from './prices-dialog.component';

describe('PricesDialogComponent', () => {
  let component: PricesDialogComponent;
  let fixture: ComponentFixture<PricesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
