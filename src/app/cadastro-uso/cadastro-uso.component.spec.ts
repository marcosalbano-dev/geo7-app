import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroUsoComponent } from './cadastro-uso.component';

describe('CadastroUsoComponent', () => {
  let component: CadastroUsoComponent;
  let fixture: ComponentFixture<CadastroUsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroUsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
