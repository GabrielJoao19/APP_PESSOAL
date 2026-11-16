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
    return this.http.post<HistoricoFitness>(`${this.apiUrl}/historicos-fitness`, {
      valor_registrado: novoPeso,
      metaId
    }).pipe(
      tap(res => {
        this.pesoAtual.set(novoPeso);
        this.historico.update(lista => [...lista, res]);
      })
    );
  }
}
