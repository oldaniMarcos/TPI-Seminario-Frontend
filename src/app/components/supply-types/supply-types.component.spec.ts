import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyTypesComponent } from './supply-types.component';

describe('SupplyTypesComponent', () => {
  let component: SupplyTypesComponent;
  let fixture: ComponentFixture<SupplyTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplyTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
