import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroLotesComponent } from './cadastro-lotes.component';

describe('CadastroLotesComponent', () => {
  let component: CadastroLotesComponent;
  let fixture: ComponentFixture<CadastroLotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroLotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
