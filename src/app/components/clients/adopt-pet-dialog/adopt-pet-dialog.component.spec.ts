import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptPetDialogComponent } from './adopt-pet-dialog.component';

describe('AdoptPetDialogComponent', () => {
  let component: AdoptPetDialogComponent;
  let fixture: ComponentFixture<AdoptPetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptPetDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptPetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
