import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroEnderecoPessoaComponent } from './cadastro-endereco-pessoa.component';

describe('CadastroEnderecoPessoaComponent', () => {
  let component: CadastroEnderecoPessoaComponent;
  let fixture: ComponentFixture<CadastroEnderecoPessoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroEnderecoPessoaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroEnderecoPessoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
