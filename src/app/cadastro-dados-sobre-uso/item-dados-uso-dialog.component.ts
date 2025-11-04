import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ItemDadosUsoDTO } from '../models/item-dados-sobre-uso.dto';
import { Cultura, CulturaService } from '../services/cultura.service';
import { UnidadeProducao } from '../models/unidade-producao';
import { AreasRestricoes, AreasRestricoesService } from '../services/areas-restricoes.service';
import { UnidadeProducaoService } from '../services/unidade-producao.service';
import { AreaComOutroUso, AreaComOutroUsoService } from '../services/area-com-outro-uso.service';
import { CategoriaAnimal, CategoriaAnimalService } from '../services/categoria-animal.service';
import { GranjeiraAgricola, GranjeiraAgricolaService } from '../services/granjeira-agricola.service';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

type DialogData = { grupo: ItemDadosUsoDTO['grupo']; item?: ItemDadosUsoDTO };

@Component({
  selector: 'app-item-dados-uso-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<h2 mat-dialog-title>{{ data.item ? 'Editar Item' : 'Adicionar Item' }}</h2>

<form [formGroup]="form" (ngSubmit)="salvar()">
  <mat-dialog-content>
    <ng-container *ngIf="carregando; else formContent">Carregando…</ng-container>
    <ng-template #formContent>

      <!-- Q06 - Produto Vegetal (Isolado) -->
      <ng-container *ngIf="data.grupo === 'Q06_ISOLADO'">
        <div class="grid g3">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Cultura</mat-label>
            <mat-select formControlName="culturaId">
              <mat-option *ngFor="let c of culturas" [value]="c.id">
                {{ c.nomeCultura }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Unidade</mat-label>
            <mat-select formControlName="unidadeProducaoId">
              <mat-option *ngFor="let u of unidades" [value]="u.id">
                {{ u.codigoUnidade }} - {{ u.unidade }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div class="spacer"></div>
        </div>

        <div class="grid g3">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Área Plantada</mat-label>
            <input matInput type="number" formControlName="areaPlantada">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Área Colhida</mat-label>
            <input matInput type="number" formControlName="areaColhida">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Qtd. Colhida</mat-label>
            <input matInput type="number" formControlName="quantidadeColhida">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Indicador de Restrição</mat-label>
          <mat-select formControlName="areasRestricoesId">
            <mat-option *ngFor="let i of indicadores" [value]="i.id">
              {{ i.codigo }} - {{ i.tipoAreaRestricao }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </ng-container>

      <!-- Q07 - Consórcio / Rotação -->
      <ng-container *ngIf="data.grupo === 'Q07_CONSORCIO_ROTACAO'">
        <div class="grid g3">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Cultura</mat-label>
            <mat-select formControlName="culturaId">
              <mat-option *ngFor="let c of culturas" [value]="c.id">
                {{ c.nomeCultura }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Unidade</mat-label>
            <mat-select formControlName="unidadeProducaoId">
              <mat-option *ngFor="let u of unidades" [value]="u.id">
                {{ u.codigoUnidade }} - {{ u.unidade }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Forma de Exploração</mat-label>
            <mat-select formControlName="formaExploracao">
              <mat-option value="CONSORCIO">Consórcio</mat-option>
              <mat-option value="ROTACAO">Rotação</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="grid g3">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Área Plantada</mat-label>
            <input matInput type="number" formControlName="areaPlantada">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Área Colhida</mat-label>
            <input matInput type="number" formControlName="areaColhida">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Qtd. Colhida</mat-label>
            <input matInput type="number" formControlName="quantidadeColhida">
          </mat-form-field>
        </div>

        <div class="grid g2">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Sequência Produto Vegetal</mat-label>
            <input matInput type="number" formControlName="sequenciaProdutoVegetal">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Indicador de Restrição</mat-label>
            <mat-select formControlName="areasRestricoesId">
              <mat-option *ngFor="let i of indicadores" [value]="i.id">
                {{ i.codigo }} - {{ i.tipoAreaRestricao }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </ng-container>

      <!-- Q08 - Granjeira / Aquícola -->
      <ng-container *ngIf="data.grupo === 'Q08_GRANJEIRA_AQUICOLA'">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Granjeira Agrícola</mat-label>
          <mat-select formControlName="granjeiraAgricolaId">
            <mat-option *ngFor="let g of granjeiras" [value]="g.id">
              {{ g.denominacao }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="grid g2">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Área Explorada</mat-label>
            <input matInput type="number" formControlName="areaExploradaGranjeiraAgricola">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Indicador de Restrição</mat-label>
            <mat-select formControlName="areasRestricoesId">
              <mat-option *ngFor="let i of indicadores" [value]="i.id">
                {{ i.codigo }} - {{ i.tipoAreaRestricao }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </ng-container>

      <!-- Q09 - Outros usos -->
      <ng-container *ngIf="data.grupo === 'Q09_OUTROS_USOS'">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Área com Outro Uso</mat-label>
          <mat-select formControlName="areaComOutroUsoId">
            <mat-option *ngFor="let a of outrosUsos" [value]="a.id">
              {{ a.codigo }} - {{ a.denominacao }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="grid g2">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Área Utilizada</mat-label>
            <input matInput type="number" formControlName="areaUtilizada">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Indicador de Restrição</mat-label>
            <mat-select formControlName="areasRestricoesId">
              <mat-option *ngFor="let i of indicadores" [value]="i.id">
                {{ i.codigo }} - {{ i.tipoAreaRestricao }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </ng-container>

      <!-- Q10 - Áreas com Restrição -->
      <ng-container *ngIf="data.grupo === 'Q10_RESTRICAO'">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Áreas Restrições</mat-label>
          <mat-select formControlName="areasRestricoesId">
            <mat-option *ngFor="let i of indicadores" [value]="i.id">
              {{ i.codigo }} - {{ i.tipoAreaRestricao }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Área com Restrição</mat-label>
          <input matInput type="number" formControlName="areaUtilizadaRestricao">
        </mat-form-field>
      </ng-container>

      <!-- Q11 - Pastagem -->
      <ng-container *ngIf="data.grupo === 'Q11_PASTAGEM'">
        <div class="grid g2">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Tipo Pastagem</mat-label>
            <input matInput formControlName="tipoPastagem">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Área Pastagem</mat-label>
            <input matInput type="number" formControlName="areaPastagem">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Indicador de Restrição</mat-label>
          <mat-select formControlName="areasRestricoesId">
            <mat-option *ngFor="let i of indicadores" [value]="i.id">
              {{ i.codigo }} - {{ i.tipoAreaRestricao }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </ng-container>

      <!-- Q12 - Pecuária -->
      <ng-container *ngIf="data.grupo === 'Q12_INFO_PECUARIA'">
        <div class="grid g2">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Categoria Animal</mat-label>
            <mat-select formControlName="categoriaAnimalId">
              <mat-option *ngFor="let c of categoriasAnimal" [value]="c.id">
                {{ c.codigo }} - {{ c.denominaoCategoriaAnimal }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Quantidade Animal</mat-label>
            <input matInput type="number" formControlName="quantidadeAnimal">
          </mat-form-field>
        </div>
      </ng-container>

      <!-- Q13 - Sem restrição / Sem uso -->
      <ng-container *ngIf="data.grupo === 'Q13_SEM_RESTRICAO_SEM_USO'">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Área Aproveitável Não Utilizada</mat-label>
          <input matInput type="number" formControlName="areaAproveitavelNaoUtilizada">
        </mat-form-field>
      </ng-container>

    </ng-template>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-stroked-button type="button" (click)="fechar()">Fechar</button>
    <button mat-flat-button color="primary" type="submit">Salvar</button>
  </mat-dialog-actions>
</form>
  `,
  styles: [`
    /* grid util */
    .grid { display: grid; gap: 12px; }
    .g3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .g2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .full { width: 100%; }
    .full-width { width: 100%; }
    .spacer { display: block; }

    /* responsivo do dialog: quebra para 1 coluna no mobile */
    @media (max-width: 720px) {
      .g3, .g2 { grid-template-columns: 1fr; }
      :host ::ng-deep .mat-mdc-dialog-surface { max-width: 96vw; }
    }
  `]
})
export class ItemDadosUsoDialogComponent implements OnInit {
  form!: FormGroup;

  culturas: Cultura[] = [];
  unidades: UnidadeProducao[] = [];
  indicadores: AreasRestricoes[] = [];
  outrosUsos: AreaComOutroUso[] = [];
  categoriasAnimal: CategoriaAnimal[] = [];
  granjeiras: GranjeiraAgricola[] = [];

  carregando = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private ref: MatDialogRef<ItemDadosUsoDialogComponent>,
    private culturaSrv: CulturaService,
    private unidadeSrv: UnidadeProducaoService,
    private indicadorSrv: AreasRestricoesService,
    private outroUsoSrv: AreaComOutroUsoService,
    private catAnimalSrv: CategoriaAnimalService,
    private granjeiraSrv: GranjeiraAgricolaService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // carrega tudo em paralelo, mas com fallback em caso de erro
    forkJoin({
      culturas: this.culturaSrv.listarTodas().pipe(
        catchError((err) => {
          console.error('Erro ao carregar culturas:', err);
          return of([]);
        })
      ),
      unidades: this.unidadeSrv.listarTodas().pipe(
        catchError((err) => {
          console.error('Erro ao carregar unidades de produção:', err);
          console.error('Erro completo:', JSON.stringify(err, null, 2));
          return of([]);
        })
      ),
      indicadores: this.indicadorSrv.listarTodas().pipe(
        catchError((err) => {
          console.error('Erro ao carregar indicadores:', err);
          return of([]);
        })
      ),
      outrosUsos: this.outroUsoSrv.listarTodas().pipe(
        catchError((err) => {
          console.error('Erro ao carregar outros usos:', err);
          return of([]);
        })
      ),
      categorias: this.catAnimalSrv.listarTodas().pipe(
        catchError((err) => {
          console.error('Erro ao carregar categorias animal:', err);
          return of([]);
        })
      ),
      granjeiras: this.granjeiraSrv.listarTodas().pipe(
        catchError((err) => {
          console.error('Erro ao carregar granjeiras:', err);
          return of([]);
        })
      ),
    })
      .pipe(finalize(() => {
          this.carregando = false; 
          this.cdr.markForCheck();
        }))
      .subscribe(res => {
        console.log('Dados carregados:', {
          culturas: res.culturas?.length ?? 0,
          unidades: res.unidades?.length ?? 0,
          indicadores: res.indicadores?.length ?? 0,
          outrosUsos: res.outrosUsos?.length ?? 0,
          categorias: res.categorias?.length ?? 0,
          granjeiras: res.granjeiras?.length ?? 0,
        });
        console.log('Unidades carregadas:', res.unidades);
        this.culturas = res.culturas ?? [];
        this.unidades = res.unidades ?? [];
        this.indicadores = res.indicadores ?? [];
        this.outrosUsos = res.outrosUsos ?? [];
        this.categoriasAnimal = res.categorias ?? [];
        this.granjeiras = res.granjeiras ?? [];
        this.cdr.markForCheck();
      });

    // cria form com TODOS os possíveis controles
    this.form = this.fb.group({
      // comuns aos quadros 6/7
      culturaId: [null],
      formaExploracao: [null],
      sequenciaProdutoVegetal: [null],
      areaPlantada: [0],
      areaColhida: [0],
      quantidadeColhida: [0],
      unidadeProducaoId: [null],
      // indicadores / genéricos
      areasRestricoesId: [null],
      areaUtilizada: [0],
      areaUtilizadaRestricao: [0],
      // Q08
      granjeiraAgricolaId: [null],
      areaExploradaGranjeiraAgricola: [0],
      // Q09
      areaComOutroUsoId: [null],
      // Q11
      tipoPastagem: [''],
      areaPastagem: [0],
      // Q12
      categoriaAnimalId: [null],
      quantidadeAnimal: [0],
      // Q13
      areaAproveitavelNaoUtilizada: [0],
    });

    // default para Q07
    if (this.data.grupo === 'Q07_CONSORCIO_ROTACAO') {
      this.form.get('formaExploracao')!.setValue('CONSORCIO');
    }

    // validações por grupo - todos os campos são opcionais
    // Mantém apenas validações de mínimo para valores numéricos quando informados
    switch (this.data.grupo) {
      case 'Q06_ISOLADO':
        // Todos opcionais - sem validações obrigatórias
        break;

      case 'Q07_CONSORCIO_ROTACAO':
        // Todos opcionais - sem validações obrigatórias
        break;

      case 'Q08_GRANJEIRA_AQUICOLA':
        this.form.get('areaExploradaGranjeiraAgricola')?.addValidators([Validators.min(0)]);
        break;

      case 'Q09_OUTROS_USOS':
        this.form.get('areaUtilizada')?.addValidators([Validators.min(0)]);
        break;

      case 'Q10_RESTRICAO':
        this.form.get('areaUtilizadaRestricao')?.addValidators([Validators.min(0)]);
        break;

      case 'Q11_PASTAGEM':
        this.form.get('areaPastagem')?.addValidators([Validators.min(0)]);
        break;

      case 'Q12_INFO_PECUARIA':
        this.form.get('quantidadeAnimal')?.addValidators([Validators.min(0)]);
        break;

      case 'Q13_SEM_RESTRICAO_SEM_USO':
        this.form.get('areaAproveitavelNaoUtilizada')?.addValidators([Validators.min(0)]);
        break;
    }

    this.form.updateValueAndValidity({ emitEvent: false });

    // Sequência produto vegetal é opcional - sem validação obrigatória
    // Mantém apenas validação de mínimo quando informado
    this.form.get('formaExploracao')!.valueChanges.subscribe(v => {
      const ctrl = this.form.get('sequenciaProdutoVegetal')!;
      if (v === 'CONSORCIO') {
        // Opcional - apenas validação de mínimo se informado
        ctrl.addValidators([Validators.min(1)]);
      } else {
        ctrl.clearValidators();
        // Não limpa o valor - permite manter o valor mesmo mudando de CONSÓRCIO
      }
      ctrl.updateValueAndValidity();
    });

    // se veio item para editar, popula
    if (this.data.item) {
      this.form.patchValue(this.data.item);
      this.cdr.markForCheck();
    }
  }

  fechar(): void { this.ref.close(); }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = { ...this.form.value };

    // zera campos não usados conforme grupo
    if (this.data.grupo !== 'Q07_CONSORCIO_ROTACAO') {
      v.formaExploracao = null;
      v.sequenciaProdutoVegetal = null;
    }
    if (this.data.grupo !== 'Q08_GRANJEIRA_AQUICOLA') {
      v.granjeiraAgricolaId = null;
      v.areaExploradaGranjeiraAgricola = 0;
    }
    if (this.data.grupo !== 'Q09_OUTROS_USOS' && this.data.grupo !== 'Q10_RESTRICAO') {
      v.areaUtilizada = 0;
    }
    if (this.data.grupo !== 'Q10_RESTRICAO') {
      v.areaUtilizadaRestricao = 0;
    }
    if (this.data.grupo !== 'Q11_PASTAGEM') {
      v.tipoPastagem = null;
      v.areaPastagem = 0;
    }
    if (this.data.grupo !== 'Q12_INFO_PECUARIA') {
      v.categoriaAnimalId = null;
      v.quantidadeAnimal = 0;
    }
    if (this.data.grupo !== 'Q13_SEM_RESTRICAO_SEM_USO') {
      v.areaAproveitavelNaoUtilizada = 0;
    }

    const novo: ItemDadosUsoDTO = {
      grupo: this.data.grupo,
      culturaId: v.culturaId ?? null,
      formaExploracao: v.formaExploracao ?? null,
      sequenciaProdutoVegetal: v.sequenciaProdutoVegetal ?? null,
      areaPlantada: +v.areaPlantada || 0,
      areaColhida: +v.areaColhida || 0,
      quantidadeColhida: +v.quantidadeColhida || 0,
      unidadeProducaoId: v.unidadeProducaoId ?? null,
      areasRestricoesId: v.areasRestricoesId ?? null,
      areaUtilizada: +v.areaUtilizada || 0,
      areaUtilizadaRestricao: +v.areaUtilizadaRestricao || 0,
      granjeiraAgricolaId: v.granjeiraAgricolaId ?? null,
      areaExploradaGranjeiraAgricola: +v.areaExploradaGranjeiraAgricola || 0,
      areaComOutroUsoId: v.areaComOutroUsoId ?? null,
      tipoPastagem: v.tipoPastagem ?? null,
      areaPastagem: +v.areaPastagem || 0,
      categoriaAnimalId: v.categoriaAnimalId ?? null,
      quantidadeAnimal: +v.quantidadeAnimal || 0,
      areaAproveitavelNaoUtilizada: +v.areaAproveitavelNaoUtilizada || 0,
    };

    this.ref.close(novo);
  }
}
