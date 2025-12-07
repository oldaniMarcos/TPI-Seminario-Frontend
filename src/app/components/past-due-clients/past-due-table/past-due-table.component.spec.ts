import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastDueTableComponent } from './past-due-table.component';

describe('PastDueTableComponent', () => {
  let component: PastDueTableComponent;
  let fixture: ComponentFixture<PastDueTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastDueTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastDueTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
