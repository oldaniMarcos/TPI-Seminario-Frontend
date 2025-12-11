import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetsDialogComponent } from './vets-dialog.component';

describe('VetsDialogComponent', () => {
  let component: VetsDialogComponent;
  let fixture: ComponentFixture<VetsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
