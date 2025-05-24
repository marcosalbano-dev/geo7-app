import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaLotesComponent } from './consulta-lotes.component';

describe('ConsultaLotesComponent', () => {
  let component: ConsultaLotesComponent;
  let fixture: ComponentFixture<ConsultaLotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaLotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
