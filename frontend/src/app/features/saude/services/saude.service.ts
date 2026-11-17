import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HistoricoFitness, MetaFitness } from '../../../core/models/app.models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaudeService {
  private http = inject(HttpClient);
  private apiUrl = '/api/saude';

  public pesoAtual = signal<number>(78.5);
  public historico = signal<HistoricoFitness[]>([]);
  public metas = signal<MetaFitness[]>([]);

  carregarMetas() {
    return this.http.get<MetaFitness[]>(`${this.apiUrl}/metas-fitness`).pipe(
      tap(metas => {
        if (metas) {
          this.metas.set(metas);
          const metaPeso = metas.find(m => m.unidade?.toLowerCase() === 'kg') || metas[0];
          if (metaPeso && metaPeso.valor_atual) {
            this.pesoAtual.set(metaPeso.valor_atual);
          }
        }
      })
    );
  }

  criarMeta(nome: string, unidade: string, valor_atual: number, valor_alvo: number, usuarioId: number = 1) {
    return this.http.post<MetaFitness>(`${this.apiUrl}/metas-fitness`, {
      nome,
      unidade,
      valor_atual,
      valor_alvo,
      usuarioId
    }).pipe(
      tap(nova => {
        this.metas.update(lista => [...lista, nova]);
      })
    );
  }

  deletarMeta(id: number) {
    return this.http.delete(`${this.apiUrl}/metas-fitness/${id}`).pipe(
      tap(() => {
        this.metas.update(lista => lista.filter(m => m.id !== id));
      })
    );
  }

  carregarHistorico() {
    return this.http.get<HistoricoFitness[]>(`${this.apiUrl}/historicos-fitness`).pipe(
      tap(dados => {
        if (dados && dados.length > 0) {
          this.historico.set(dados);
          const ultimo = dados[dados.length - 1];
          if (ultimo && ultimo.valor_registrado) {
            this.pesoAtual.set(ultimo.valor_registrado);
          }
        }
      })
    );
  }

  atualizarPeso(novoPeso: number, metaId: number = 1) {
    const idMeta = this.metas()[0]?.id || metaId;
    return this.http.post<HistoricoFitness>(`${this.apiUrl}/historicos-fitness`, {
      valor_registrado: novoPeso,
      metaId: idMeta
    }).pipe(
      tap(res => {
        this.pesoAtual.set(novoPeso);
        this.historico.update(lista => [...lista, res]);
        this.metas.update(lista =>
          lista.map(m => (m.id === idMeta ? { ...m, valor_atual: novoPeso } : m))
        );
      })
    );
  }
}
