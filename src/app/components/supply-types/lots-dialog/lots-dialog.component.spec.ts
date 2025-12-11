import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsDialogComponent } from './lots-dialog.component';

describe('LotsDialogComponent', () => {
  let component: LotsDialogComponent;
  let fixture: ComponentFixture<LotsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
