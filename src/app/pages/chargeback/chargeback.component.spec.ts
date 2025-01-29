import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargebackComponent } from './chargeback.component';

describe('ChargebackComponent', () => {
  let component: ChargebackComponent;
  let fixture: ComponentFixture<ChargebackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargebackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargebackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
