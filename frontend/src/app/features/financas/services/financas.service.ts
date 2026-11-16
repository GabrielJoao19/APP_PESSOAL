import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Envelope, Gasto } from '../../../core/models/app.models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancasService {
  private http = inject(HttpClient);
  private apiUrl = '/api/financas';

  public envelopes = signal<Envelope[]>([]);
  public gastos = signal<Gasto[]>([]);

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

  adicionarGasto(descricao: string, valor: number, envelopeId: number, usuarioId: number = 1) {
    return this.http.post<Gasto>(`${this.apiUrl}/gastos`, {
      descricao,
      valor,
      envelopeId,
      usuarioId
    }).pipe(
      tap(() => {
        // Recarrega os envelopes para atualizar o valor gasto
        this.carregarEnvelopes().subscribe();
      })
    );
  }
}
