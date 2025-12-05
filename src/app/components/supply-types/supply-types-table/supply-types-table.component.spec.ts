import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyTypesTableComponent } from './supply-types-table.component';

describe('SupplyTypesTableComponent', () => {
  let component: SupplyTypesTableComponent;
  let fixture: ComponentFixture<SupplyTypesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyTypesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplyTypesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
