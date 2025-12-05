import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetsTableComponent } from './vets-table.component';

describe('VetsTableComponent', () => {
  let component: VetsTableComponent;
  let fixture: ComponentFixture<VetsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
