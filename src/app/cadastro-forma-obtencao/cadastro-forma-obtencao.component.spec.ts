import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroFormaObtencaoComponent } from './cadastro-forma-obtencao.component';

describe('CadastroFormaObtencaoComponent', () => {
  let component: CadastroFormaObtencaoComponent;
  let fixture: ComponentFixture<CadastroFormaObtencaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroFormaObtencaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroFormaObtencaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
