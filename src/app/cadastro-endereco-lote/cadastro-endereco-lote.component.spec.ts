import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroEnderecoLoteComponent } from './cadastro-endereco-lote.component';

describe('CadastroEnderecoLoteComponent', () => {
  let component: CadastroEnderecoLoteComponent;
  let fixture: ComponentFixture<CadastroEnderecoLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroEnderecoLoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroEnderecoLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
