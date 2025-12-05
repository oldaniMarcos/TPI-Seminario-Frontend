import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsTableComponent } from './lots-table.component';

describe('LotsTableComponent', () => {
  let component: LotsTableComponent;
  let fixture: ComponentFixture<LotsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
