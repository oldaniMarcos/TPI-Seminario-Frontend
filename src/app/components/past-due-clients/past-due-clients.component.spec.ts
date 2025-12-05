import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastDueClientsComponent } from './past-due-clients.component';

describe('PastDueClientsComponent', () => {
  let component: PastDueClientsComponent;
  let fixture: ComponentFixture<PastDueClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastDueClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastDueClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
