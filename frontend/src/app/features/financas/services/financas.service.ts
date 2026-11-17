import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Envelope, Gasto, MetaFinanceira, Investimento, TipoInvestimento } from '../../../core/models/app.models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancasService {
  private http = inject(HttpClient);
  private apiUrl = '/api/financas';

  public envelopes = signal<Envelope[]>([]);
  public gastos = signal<Gasto[]>([]);
  public metasFinanceiras = signal<MetaFinanceira[]>([]);
  public investimentos = signal<Investimento[]>([]);
  public tiposInvestimento = signal<TipoInvestimento[]>([]);

  public totalOrcamentoMes = computed(() =>
    this.envelopes().reduce((acc, env) => acc + (env.limite ?? env.valor_total ?? 0), 0)
  );

  public totalGastoMes = computed(() =>
    this.envelopes().reduce((acc, env) => acc + (env.valor_gasto ?? 0), 0)
  );

  public gastoHoje = computed(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    const gastosLista = this.gastos();
    const gastosDoDia = gastosLista.filter(g => !g.criadoEm || g.criadoEm.slice(0, 10) === hoje);
    return gastosDoDia.reduce((acc, g) => acc + (g.valor ?? 0), 0);
  });

  carregarEnvelopes() {
    return this.http.get<Envelope[]>(`${this.apiUrl}/envelopes`).pipe(
      tap(envelopes => {
        if (envelopes) {
          this.envelopes.set(envelopes);
        }
      })
    );
  }

  criarEnvelope(nome: string, limite: number, usuarioId: number = 1) {
    return this.http.post<Envelope>(`${this.apiUrl}/envelopes`, {
      nome,
      limite,
      usuarioId
    }).pipe(
      tap(novo => {
        this.envelopes.update(lista => [...lista, novo]);
      })
    );
  }

  deletarEnvelope(id: number) {
    return this.http.delete(`${this.apiUrl}/envelopes/${id}`).pipe(
      tap(() => {
        this.envelopes.update(lista => lista.filter(e => e.id !== id));
      })
    );
  }

  carregarGastos() {
    return this.http.get<Gasto[]>(`${this.apiUrl}/gastos`).pipe(
      tap(gastos => {
        if (gastos) {
          this.gastos.set(gastos);
        }
      })
    );
  }

  adicionarGasto(descricao: string, valor: number, envelopeId: number, usuarioId: number = 1) {
    return this.http.post<Gasto>(`${this.apiUrl}/gastos`, {
      descricao,
      valor,
      envelopeId,
      usuarioId
    }).pipe(
      tap(novoGasto => {
        this.gastos.update(lista => [novoGasto, ...lista]);
        this.envelopes.update(lista =>
          lista.map(e => (e.id === envelopeId ? { ...e, valor_gasto: (e.valor_gasto || 0) + valor } : e))
        );
        this.carregarEnvelopes().subscribe({ error: () => {} });
      })
    );
  }

  deletarGasto(id: number) {
    const gastoRemovido = this.gastos().find(g => g.id === id);
    return this.http.delete(`${this.apiUrl}/gastos/${id}`).pipe(
      tap(() => {
        this.gastos.update(lista => lista.filter(g => g.id !== id));
        if (gastoRemovido) {
          this.envelopes.update(lista =>
            lista.map(e =>
              e.id === gastoRemovido.envelopeId
                ? { ...e, valor_gasto: Math.max(0, (e.valor_gasto || 0) - gastoRemovido.valor) }
                : e
            )
          );
        }
        this.carregarEnvelopes().subscribe({ error: () => {} });
      })
    );
  }

  carregarMetasFinanceiras() {
    return this.http.get<MetaFinanceira[]>(`${this.apiUrl}/metas-financeiras`).pipe(
      tap(metas => {
        if (metas) {
          this.metasFinanceiras.set(metas);
        }
      })
    );
  }

  criarMetaFinanceira(nome: string, valor_alvo: number, valor_atual: number = 0, usuarioId: number = 1) {
    return this.http.post<MetaFinanceira>(`${this.apiUrl}/metas-financeiras`, {
      nome,
      valor_alvo,
      valor_atual,
      usuarioId
    }).pipe(
      tap(nova => {
        this.metasFinanceiras.update(lista => [...lista, nova]);
      })
    );
  }

  atualizarMetaFinanceira(id: number, valor_atual: number) {
    return this.http.patch<MetaFinanceira>(`${this.apiUrl}/metas-financeiras/${id}`, {
      valor_atual
    }).pipe(
      tap(atualizada => {
        this.metasFinanceiras.update(lista =>
          lista.map(m => (m.id === id ? { ...m, valor_atual: atualizada.valor_atual ?? valor_atual } : m))
        );
      })
    );
  }

  deletarMetaFinanceira(id: number) {
    return this.http.delete(`${this.apiUrl}/metas-financeiras/${id}`).pipe(
      tap(() => {
        this.metasFinanceiras.update(lista => lista.filter(m => m.id !== id));
      })
    );
  }

  carregarInvestimentos() {
    return this.http.get<Investimento[]>(`${this.apiUrl}/investimentos`).pipe(
      tap(inv => {
        if (inv) {
          this.investimentos.set(inv);
        }
      })
    );
  }

  carregarTiposInvestimento() {
    return this.http.get<TipoInvestimento[]>(`${this.apiUrl}/tipos-investimento`).pipe(
      tap(tipos => {
        if (tipos) {
          this.tiposInvestimento.set(tipos);
        }
      })
    );
  }

  criarTipoInvestimento(nome: string, taxa: number, prazo_saque: string = 'Imediato') {
    return this.http.post<TipoInvestimento>(`${this.apiUrl}/tipos-investimento`, {
      nome,
      taxa,
      prazo_saque
    }).pipe(
      tap(novo => {
        this.tiposInvestimento.update(lista => [...lista, novo]);
      })
    );
  }

  criarInvestimento(
    nome: string,
    tipo: string,
    valor_investido: number,
    valor_atual: number,
    tipoInvestimentoId: number,
    usuarioId: number = 1
  ) {
    return this.http.post<Investimento>(`${this.apiUrl}/investimentos`, {
      nome,
      tipo,
      valor_investido,
      valor_atual,
      tipoInvestimentoId,
      usuarioId
    }).pipe(
      tap(novo => {
        this.investimentos.update(lista => [...lista, novo]);
      })
    );
  }

  deletarInvestimento(id: number) {
    return this.http.delete(`${this.apiUrl}/investimentos/${id}`).pipe(
      tap(() => {
        this.investimentos.update(lista => lista.filter(i => i.id !== id));
      })
    );
  }
}
