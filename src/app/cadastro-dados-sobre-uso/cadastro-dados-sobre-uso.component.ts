import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ItemDadosUsoDTO } from '../models/item-dados-sobre-uso.dto';
import { DadosSobreUsoService } from '../services/dados-sobre-uso.service';
import { DadosSobreUsoDTO } from '../models/dados-sobre-uso.dto';
import { ItemDadosUsoDialogComponent } from '../cadastro-dados-sobre-uso/item-dados-uso-dialog.component';
import { ConfirmDialogComponent } from './shared-confirm-dialog.component';
import { Cultura, CulturaService } from "../services/cultura.service";
import { AreaComOutroUso, AreaComOutroUsoService } from "../services/area-com-outro-uso.service";
import { AreasRestricoes, AreasRestricoesService } from '../services/areas-restricoes.service';
import { CategoriaAnimal, CategoriaAnimalService } from '../services/categoria-animal.service';
import { forkJoin, of } from 'rxjs';
import { Location } from '@angular/common';
import { BackButtonComponent } from '../shared/components/back-button/back-button.component';

type ItemExt = ItemDadosUsoDTO & { meta?: { label: string } };
type ItemView = ItemExt & { _k: number };

@Component({
  selector: 'app-cadastro-dados-sobre-uso',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    MatExpansionModule,
    MatSnackBarModule,
    BackButtonComponent
  ],
  templateUrl: './cadastro-dados-sobre-uso.component.html',
  styleUrl: './cadastro-dados-sobre-uso.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CadastroDadosSobreUsoComponent implements OnInit {



  culturas: Cultura[] = [];
  areasComOutroUso: AreaComOutroUso[] = [];
  areasRestricoes: AreasRestricoes[] = [];
  categoriasAnimal: CategoriaAnimal[] = [];

  culturaById = new Map<number, Cultura>();
  areaComOutroUsoById = new Map<number, AreaComOutroUso>();
  areasRestricoesById = new Map<number, AreasRestricoes>();
  categoriaAnimalById = new Map<number, CategoriaAnimal>();

  formDadosSobreUso!: FormGroup;

  private loteId!: number;
  /** ids que vieram do backend (para saber o que foi removido) */
  private originalItemIds = new Set<number>();
  atualizando = false;
  dto!: DadosSobreUsoDTO;
  dadosSobreUsoId!: number | null;


  // visão agrupada (somente exibição)
  grupos: { code: ItemDadosUsoDTO['grupo']; title: string }[] = [
    { code: 'Q06_ISOLADO', title: 'Produto Vegetal [Quadro 6 e 7] - Isolado' },
    { code: 'Q07_CONSORCIO_ROTACAO', title: 'Produto Vegetal [Quadro 7] - Consórcio/Rotação' },
    { code: 'Q08_GRANJEIRA_AQUICOLA', title: 'Granjeira ou Aquícola [Quadro 8]' },
    { code: 'Q09_OUTROS_USOS', title: 'Áreas com Outros Usos [Quadro 9]' },
    { code: 'Q10_RESTRICAO', title: 'Áreas com Restrição [Quadro 10]' },
    { code: 'Q11_PASTAGEM', title: 'Áreas com Pastagem [Quadro 11]' },
    { code: 'Q12_INFO_PECUARIA', title: 'Informações sobre Pecuária [Quadro 12]' },
    { code: 'Q13_SEM_RESTRICAO_SEM_USO', title: 'Áreas sem restrição e Sem Usos [Quadro 13]' },
  ];



  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: DadosSobreUsoService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private culturaService: CulturaService,
    private areaComOutroUsoService: AreaComOutroUsoService,
    private areasRestricoesService: AreasRestricoesService,
    private categoriaAnimalService: CategoriaAnimalService,
    private location: Location
  ) { }

  private makeEmptyDto(): DadosSobreUsoDTO {
    return {
      id: undefined,
      loteId: this.loteId,         // será setado assim que ler o query param
      items: [],
      areaTotalIsolado: 0,
      areaTotalConsorcio: 0,
      areaTotalRotacao: 0,
    };
  }

  ngOnInit(): void {
    // 1) já começa com DTO vazio
    this.dto = this.makeEmptyDto();

    // lookups
    this.culturaService.listarTodas().subscribe(c => {
      this.culturas = c;
      this.culturaById = new Map(c.map(x => [x.id, x]));
    });

    this.areaComOutroUsoService.listarTodas().subscribe(list => {
      this.areasComOutroUso = list;
      this.areaComOutroUsoById = new Map(list.map(x => [x.id, x]));
    });

    this.areasRestricoesService.listarTodas().subscribe(list => {
      this.areasRestricoes = list;
      this.areasRestricoesById = new Map(list.map(x => [x.id, x]));
    });

    this.categoriaAnimalService.listarTodas().subscribe(list => {
      this.categoriasAnimal = list;
      this.categoriaAnimalById = new Map(list.map(x => [x.id, x]));
    });

    // loteId e carga
    this.route.queryParamMap.subscribe(qp => {
      const q = qp.get('loteId');
      const fromPath = this.route.snapshot.paramMap.get('loteId');
      const fromState = (this.router.getCurrentNavigation()?.extras.state as any)?.loteId;
      const id = Number(q ?? fromPath ?? fromState);

      if (Number.isFinite(id) && id > 0) {
        this.loteId = id;
        this.dto.loteId = id; // << garante o lote no dto base
        this.carregarPorLote(this.loteId);
      } else {
        console.warn('loteId não encontrado na URL.');
      }
    });
    // ... criação do form
    this.formDadosSobreUso = this.fb.group({
      unidadeProducaoId: [null],
      codigoUnidadeProducao: [''],
      areaTotalIsolado: [0, [Validators.min(0)]],
      areaTotalConsorcio: [0, [Validators.min(0)]],
      areaTotalRotacao: [0, [Validators.min(0)]],
    });
  }

  areaOf(i: ItemDadosUsoDTO): number {
    return Number(
      i.areaPlantada ??
      i.areaUtilizada ??
      i.areaPastagem ??
      i.areaExploradaGranjeiraAgricola ??
      i.areaAproveitavelNaoUtilizada ??
      0
    ) || 0;
  }

  abrirDialog(grupo: string) {
    this.dialog.open(ItemDadosUsoDialogComponent, { data: { grupo } });
  }

  private patchFromDto(dto: DadosSobreUsoDTO | null | undefined): void {
    if (!dto) {
      this.dto = { ...this.makeEmptyDto(), loteId: this.loteId };
      this.originalItemIds.clear();
      this.recalculaTotais();
      this.cdr.markForCheck();
      return;
    }

    const items = this.extractItemsFromApi(dto).map(i => this.normItem(i));

    this.dto = {
      ...this.makeEmptyDto(),
      ...dto,
      loteId: dto.loteId ?? this.loteId,
      items,
    };

    // guarda ids enviados pelo backend
    this.originalItemIds = new Set(
      (this.dto.items ?? [])
        .map((i: any) => i?.id)
        .filter((id: any) => typeof id === 'number')
    );

    this.recalculaTotais();
    this.atualizando = !!dto.id;
    this.cdr.markForCheck();
  }

  private carregarPorLote(id: number) {
    console.log(this.dto)
    this.service.buscarPorLote(id).subscribe({
      next: dto => this.patchFromDto(dto),
      error: err => console.error('Erro ao buscar por lote:', err)
    });
  }

  private nomeDe(obj: any, ...keys: string[]): string | undefined {
    for (const k of keys) {
      const v = obj?.[k];
      if (v !== undefined && v !== null && v !== '') return String(v);
    }
    return undefined;
  }

  buildMeta(it: ItemDadosUsoDTO): { label: string } {
    const cultura = this.culturas?.find(c => c.id === it.culturaId);
    const outroUso = this.areasComOutroUso?.find(a => a.id === it.areaComOutroUsoId);
    const restr = this.areasRestricoes?.find(r => r.id === it.areasRestricoesId);
    const catAnim = this.categoriasAnimal?.find(ca => ca.id === it.categoriaAnimalId);

    const label =
      this.nomeDe(cultura, 'nome', 'nomeCultura', 'descricao') ??
      this.nomeDe(outroUso, 'nome', 'denominacao', 'descricao') ??
      this.nomeDe(restr, 'nome', 'tipoAreaRestricao', 'descricao') ??
      this.nomeDe(catAnim, 'nome', 'denominaoCategoriaAnimal', 'descricao') ??
      'Item';

    return { label };
  }

  // ===== Helpers =====
  private asNumber(v: unknown): number {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  }

  /** tira campos de UI (meta) e preserva id quando existir */
  private sanitizeItems(items: Array<ItemExt | ItemDadosUsoDTO>) {
    return (items ?? []).map((raw: any) => {
      const { meta, _k, ...rest } = raw || {};
      const out: any = {
        ...rest,
        areaGeralItem: this.computeAreaGeral(rest),
      };
      if (out.grupo === 'Q06_ISOLADO') {
        out.formaExploracao = null;
        out.sequenciaProdutoVegetal = null;
      }
      if (out.grupo !== 'Q09_OUTROS_USOS' && out.grupo !== 'Q10_RESTRICAO') {
        out.areaUtilizada = 0;
      }
      return out;
    });
  }

  private computeAreaGeral(i: any): number {
    const n = (x: any) => (Number.isFinite(+x) ? +x : 0);
    switch (i.grupo) {
      case 'Q06_ISOLADO':
      case 'Q07_CONSORCIO_ROTACAO':
        return n(i.areaPlantada);
      case 'Q08_GRANJEIRA_AQUICOLA':
        return n(i.areaExploradaGranjeiraAgricola);
      case 'Q09_OUTROS_USOS':
        return n(i.areaUtilizada);
      case 'Q10_RESTRICAO':
        return n(i.areaUtilizadaRestricao);
      case 'Q11_PASTAGEM':
        return n(i.areaPastagem);
      case 'Q12_INFO_PECUARIA':
        return 0;
      case 'Q13_SEM_RESTRICAO_SEM_USO':
        return n(i.areaAproveitavelNaoUtilizada);
      default:
        return 0;
    }
  }

  // Use o “?” em todos os acessos
  itensDoGrupo(g: ItemDadosUsoDTO['grupo']): ItemView[] {
    const src = this.dto?.items ?? [];
    const out: ItemView[] = [];
    src.forEach((it, idx) => {
      if (it.grupo === g) {
        out.push({ ...it, meta: this.buildMeta(it), _k: idx });
      }
    });
    return out;
  }

  // 1) Pega o array de itens independente do nome da propriedade
  private extractItemsFromApi(raw: any): any[] {
    const candidates = [
      raw?.items,
      raw?.itens,                    // comum em APIs PT
      raw?.itensDadosUso,
      raw?.lista,
      raw?.listaItens
    ];
    return candidates.find((x: any) => Array.isArray(x)) ?? [];
  }

  // 2) Normaliza o "grupo" para os códigos usados na tela
  private normGrupo(raw: any): ItemDadosUsoDTO['grupo'] | null {
    if (raw == null) return null;
    const v = String(raw).toUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

    if (['Q06_ISOLADO', 'Q06', 'Q6', '6', 'ISOLADO'].some(t => v.includes(t))) return 'Q06_ISOLADO';
    if (['Q07_CONSORCIO_ROTACAO', 'Q07', 'Q7', '7', 'CONSORCIO', 'ROTACAO'].some(t => v.includes(t))) return 'Q07_CONSORCIO_ROTACAO';
    if (['Q08_GRANJEIRA_AQUICOLA', 'Q08', 'Q8', '8', 'GRANJEIRA', 'AQUICOLA', 'AQUICOLA'].some(t => v.includes(t))) return 'Q08_GRANJEIRA_AQUICOLA';
    if (['Q09_OUTROS_USOS', 'Q09', 'Q9', '9', 'OUTRO'].some(t => v.includes(t))) return 'Q09_OUTROS_USOS';
    if (['Q10_RESTRICAO', 'Q10', '10', 'RESTRICAO'].some(t => v.includes(t))) return 'Q10_RESTRICAO';
    if (['Q11_PASTAGEM', 'Q11', '11', 'PASTAGEM'].some(t => v.includes(t))) return 'Q11_PASTAGEM';
    if (['Q12_INFO_PECUARIA', 'Q12', '12', 'PECUARIA'].some(t => v.includes(t))) return 'Q12_INFO_PECUARIA';
    if (['Q13_SEM_RESTRICAO_SEM_USO', 'Q13', '13', 'SEM_RESTRICAO', 'SEM_USO'].some(t => v.includes(t))) return 'Q13_SEM_RESTRICAO_SEM_USO';

    return null;
  }

  // 3) Normaliza nomes de campos e números para cada item
  private normItem(raw: any): ItemDadosUsoDTO {
    const n = (x: any) => (Number.isFinite(+x) ? +x : 0);

    // aliases (camel + snake)
    const culturaId = raw.culturaId ?? raw.cultura_id ?? raw.culturaID ?? raw.cultura?.id ?? null;
    const unidProdId = raw.unidadeProducaoId ?? raw.unidade_producao_id ?? raw.unidadeProducaoID ?? raw.unidade?.id ?? null;
    const restrId = raw.areasRestricoesId ?? raw.areas_restricoes_id ?? raw.indicadorRestricaoId ?? raw.restricaoId ?? null;
    const granjId = raw.granjeiraAgricolaId ?? raw.granjeira_agricola_id ?? raw.granjeiraId ?? null;
    const outroUsoId = raw.areaComOutroUsoId ?? raw.area_com_outro_uso_id ?? raw.outroUsoId ?? null;
    const catAnimalId = raw.categoriaAnimalId ?? raw.categoria_animal_id ?? raw.categoriaId ?? null;

    const areaPlant = n(raw.areaPlantada ?? raw.area_plantada);
    const areaColh = n(raw.areaColhida ?? raw.area_colhida);
    const qtdColhida = n(raw.quantidadeColhida ?? raw.quantidade_colhida);
    const areaUtil = n(raw.areaUtilizada ?? raw.area_utilizada ?? raw.areaUtilizada);
    const areaUtilRes = n(
      raw.areaUtilizadaRestricao ?? raw.area_utilizada_restricao ?? raw.areaUtilizadaRestricao
    );
    const areaPast = n(raw.areaPastagem ?? raw.area_pastagem);
    const areaExplG = n(raw.areaExploradaGranjeiraAgricola ?? raw.area_explorada_granjeira_agricola);
    const areaNAp = n(raw.areaAproveitavelNaoUtilizada ?? raw.area_aproveitavel_nao_utilizada);
    const seqPV = raw.sequenciaProdutoVegetal ?? raw.sequencia_produto_vegetal;

    let forma = (raw.formaExploracao ?? raw.forma_exploracao ?? raw.forma ?? null) as 'CONSORCIO' | 'ROTACAO' | null;

    // tenta ler um "grupo" vindo da API (com variações)
    const grupoApi = this.normGrupo(
      raw.grupo ?? raw.quadro ?? raw.tipoGrupo ?? raw.tipo_grupo ?? raw.codigoGrupo ?? raw.codigo_grupo
    );

    // se o backend disser que é Q06, não deixe formaExploracao poluir
    if (grupoApi === 'Q06_ISOLADO') {
      forma = null;
    }

    // se a API não mandou, inferimos pelo conteúdo:
    const grupoInf = this.inferGrupoFromFields({
      formaExploracao: forma,
      sequenciaProdutoVegetal: seqPV,
      granjeiraAgricolaId: granjId,
      areaComOutroUsoId: outroUsoId,
      tipoPastagem: raw.tipoPastagem ?? raw.tipo_pastagem ?? null,
      areaPastagem: areaPast,
      categoriaAnimalId: catAnimalId,
      areaAproveitavelNaoUtilizada: areaNAp,
      culturaId,
      areasRestricoesId: restrId,
      areaUtilizadaRestricao: areaUtilRes,
    });

    const grupoFinal = (grupoApi ?? grupoInf) as ItemDadosUsoDTO['grupo'];

    // Garantia extra: se ficou Q06, zere forma/seq
    if (grupoFinal === 'Q06_ISOLADO') {
      forma = null;
    }

    return {
      id: raw.id ?? raw.itemId ?? null,
      grupo: grupoFinal,
      formaExploracao: forma,

      culturaId,
      unidadeProducaoId: unidProdId,
      areasRestricoesId: restrId,

      sequenciaProdutoVegetal: grupoFinal === 'Q07_CONSORCIO_ROTACAO' ? seqPV : null,
      areaPlantada: areaPlant,
      areaColhida: areaColh,
      quantidadeColhida: qtdColhida,

      granjeiraAgricolaId: granjId,
      areaExploradaGranjeiraAgricola: areaExplG,

      areaComOutroUsoId: outroUsoId,

      tipoPastagem: raw.tipoPastagem ?? raw.tipo_pastagem ?? null,
      areaPastagem: areaPast,
      areaUtilizada: areaUtil,
      areaUtilizadaRestricao: areaUtilRes,

      categoriaAnimalId: catAnimalId,
      quantidadeAnimal: n(raw.quantidadeAnimal ?? raw.quantidade_animal),

      areaAproveitavelNaoUtilizada: areaNAp,
    };
  }

  private inferGrupoFromFields(f: {
    formaExploracao?: 'CONSORCIO' | 'ROTACAO' | null;
    sequenciaProdutoVegetal?: number | null;
    granjeiraAgricolaId?: number | null;
    areaComOutroUsoId?: number | null;
    tipoPastagem?: string | null;
    areaPastagem?: number | null;
    categoriaAnimalId?: number | null;
    areaAproveitavelNaoUtilizada?: number | null;
    culturaId?: number | null;
    areasRestricoesId?: number | null;
    areaUtilizadaRestricao?: number | null;
  }): ItemDadosUsoDTO['grupo'] {
    if (f.granjeiraAgricolaId) return 'Q08_GRANJEIRA_AQUICOLA';
    if (f.areaComOutroUsoId) return 'Q09_OUTROS_USOS';
    if (f.tipoPastagem || (Number(f.areaPastagem) || 0) > 0) return 'Q11_PASTAGEM';
    if (f.categoriaAnimalId) return 'Q12_INFO_PECUARIA';
    if ((Number(f.areaAproveitavelNaoUtilizada) || 0) > 0) return 'Q13_SEM_RESTRICAO_SEM_USO';

    // Q10: indicador/área de restrição e nenhum outro marcador
    if ((f.areasRestricoesId || (Number(f.areaUtilizadaRestricao) || 0) > 0) &&
      !f.culturaId && !f.granjeiraAgricolaId && !f.areaComOutroUsoId &&
      !f.tipoPastagem && !((Number(f.areaPastagem) || 0) > 0) &&
      !f.categoriaAnimalId && !((Number(f.areaAproveitavelNaoUtilizada) || 0) > 0)) {
      return 'Q10_RESTRICAO';
    }

    if (f.formaExploracao === 'ROTACAO') return 'Q07_CONSORCIO_ROTACAO';
    if (f.formaExploracao === 'CONSORCIO' && (Number(f.sequenciaProdutoVegetal) || 0) > 0)
      return 'Q07_CONSORCIO_ROTACAO';

    return 'Q06_ISOLADO';
  }

  addItem(grupo: ItemDadosUsoDTO['grupo']) {
    // GARANTA dto/items
    if (!this.dto) this.dto = this.makeEmptyDto();
    if (!this.dto.items) this.dto.items = [];

    const ref = this.dialog.open(ItemDadosUsoDialogComponent, {
      width: grupo === 'Q09_OUTROS_USOS' ? '700px' : '760px',
      data: { grupo }
    });

    ref.afterClosed().subscribe((novo: ItemDadosUsoDTO | undefined) => {
      if (!novo) return;

      // push seguro mesmo se estiver vazio
      this.dto!.items = [...(this.dto!.items ?? []), novo];
      this.recalculaTotais();
      this.cdr.markForCheck();
    });
  }

  // private withMeta(it: ItemDadosUsoDTO): ItemExt {
  //   return { ...it, meta: this.buildMeta(it) };
  // }

  clickItem(item: ItemExt) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { title: 'Remover item?', message: 'Deseja remover este item?' }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      // remova por id quando houver, senão por igualdade de conteúdo básica
      this.dto.items = (this.dto.items ?? []).filter(i =>
        (i as any).id ? (i as any).id !== (item as any).id : i !== item
      );
      this.recalculaTotais();
      this.cdr.markForCheck();
    });
  }

  private recalculaTotais() {
    const sum = (arr: number[]) => arr.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

    const iso = this.itensDoGrupo('Q06_ISOLADO').map(i => this.computeAreaGeral(i));

    // Q07: 1 por sequência
    const cons = this.itensDoGrupo('Q07_CONSORCIO_ROTACAO');
    const porSeq = new Map<number, number>();
    const porSeqRotacao = new Map<number, number>();

    cons.forEach(i => {
      const seq = Number(i.sequenciaProdutoVegetal) || 0;
      const area = Number(i.areaPlantada) || 0;
      if (seq > 0 && !porSeq.has(seq)) porSeq.set(seq, area);
      if (i.formaExploracao === 'ROTACAO' && seq > 0 && !porSeqRotacao.has(seq)) porSeqRotacao.set(seq, area);
    });

    this.formDadosSobreUso.patchValue({
      areaTotalIsolado: sum(iso),
      areaTotalConsorcio: sum([...porSeq.values()]),
      areaTotalRotacao: sum([...porSeqRotacao.values()]),
    }, { emitEvent: false });
  }

  onSalvar() {
    const payload: DadosSobreUsoDTO = {
      ...this.dto,
      loteId: this.loteId,
      items: this.sanitizeItems(this.dto?.items ?? []),
      areaTotalIsolado: this.asNumber(this.formDadosSobreUso.value.areaTotalIsolado),
      areaTotalConsorcio: this.asNumber(this.formDadosSobreUso.value.areaTotalConsorcio),
      areaTotalRotacao: this.asNumber(this.formDadosSobreUso.value.areaTotalRotacao),
    };

    this.service.salvar(payload).subscribe({
      next: () => {
        this.snack.open('Dados de uso salvos!', 'Fechar', { duration: 2500 });
        this.atualizando = true;
        this.carregarPorLote(this.loteId);     // <- recarrega com os itens
      },
      error: () => this.snack.open('Erro ao salvar.', 'Fechar', { duration: 3000 })
    });
  }

  trackItem = (_: number, it: any) => (it as any).id ?? it;

  onAtualizar() {
    if (!this.dto?.id) { this.onSalvar(); return; }
    // itens removidos na UI
    const items = this.sanitizeItems(this.dto.items ?? []);

    // const idsAgora = new Set<number>(
    //   items.map((i: any) => i?.id).filter((id: any) => typeof id === 'number')
    // );
    // const idsParaExcluir = [...this.originalItemIds].filter(id => !idsAgora.has(id));

    const payload: DadosSobreUsoDTO = {
      ...this.dto,
      loteId: this.loteId,
      items,
      areaTotalIsolado: this.asNumber(this.formDadosSobreUso.value.areaTotalIsolado),
      areaTotalConsorcio: this.asNumber(this.formDadosSobreUso.value.areaTotalConsorcio),
      areaTotalRotacao: this.asNumber(this.formDadosSobreUso.value.areaTotalRotacao),
    };

    this.service.atualizar(this.dto!.id!, payload).subscribe({
      next: () => {
        this.snack.open('Dados de uso atualizados!', 'Fechar', { duration: 2500 });
        this.carregarPorLote(this.loteId);     // <- recarrega com os itens
      },
      error: () => this.snack.open('Erro ao atualizar.', 'Fechar', { duration: 3000 })
    });
  }

  removerItem(item: ItemExt, ev?: MouseEvent) {
    ev?.stopPropagation();
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { title: 'Remover item?', message: 'Deseja remover este item?' }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.dto.items = (this.dto.items ?? []).filter(i =>
        (i as any).id ? (i as any).id !== (item as any).id : i !== item
      );
      this.recalculaTotais();
      this.cdr.markForCheck();
    });
  }

  onVoltarClick(): void {
    const loteId = this.formDadosSobreUso.get('loteId')?.value;
    
    if (loteId) {
      // Navega para a página de endereço do lote (anterior na sequência)
      this.router.navigate(['/cadastro-endereco-lote'], { 
        queryParams: { loteId: loteId } 
      });
    } else {
      this.location.back();
    }
  }
}
