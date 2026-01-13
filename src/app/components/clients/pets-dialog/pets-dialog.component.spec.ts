import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsDialogComponent } from './pets-dialog.component';

describe('PetsDialogComponent', () => {
  let component: PetsDialogComponent;
  let fixture: ComponentFixture<PetsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
