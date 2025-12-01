import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesBreedsComponent } from './species-breeds.component';

describe('SpeciesBreedsComponent', () => {
  let component: SpeciesBreedsComponent;
  let fixture: ComponentFixture<SpeciesBreedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeciesBreedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeciesBreedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
