import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyTypesDialogComponent } from './supply-types-dialog.component';

describe('SupplyTypesDialogComponent', () => {
  let component: SupplyTypesDialogComponent;
  let fixture: ComponentFixture<SupplyTypesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyTypesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplyTypesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
