import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroEstruturaComponent } from './cadastro-estrutura.component';

describe('CadastroEstruturaComponent', () => {
  let component: CadastroEstruturaComponent;
  let fixture: ComponentFixture<CadastroEstruturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroEstruturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroEstruturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
