import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tarefa, Diario } from '../../../core/models/app.models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutividadeService {
  private http = inject(HttpClient);
  private apiUrl = '/api/produtividade';

  public tarefas = signal<Tarefa[]>([]);
  public diarios = signal<Diario[]>([]);
  public ultimoDiario = signal<string>('');

  carregarTarefas() {
    return this.http.get<Tarefa[]>(`${this.apiUrl}/tarefas`).pipe(
      tap(tarefas => {
        if (tarefas) {
          this.tarefas.set(tarefas);
        }
      })
    );
  }

  criarTarefa(titulo: string, valor_diario: number = 15, usuarioId: number = 1) {
    return this.http.post<Tarefa>(`${this.apiUrl}/tarefas`, {
      titulo,
      valor_diario,
      usuarioId
    }).pipe(
      tap(nova => {
        this.tarefas.update(lista => [nova, ...lista]);
      })
    );
  }

  alternarTarefa(id: number) {
    const tarefaAtual = this.tarefas().find(t => t.id === id);
    if (!tarefaAtual) return;

    const novoStatus = !tarefaAtual.concluida;

    this.tarefas.update(lista =>
      lista.map(t => (t.id === id ? { ...t, concluida: novoStatus } : t))
    );

    this.http.patch(`${this.apiUrl}/tarefas/${id}`, { concluida: novoStatus }).subscribe({ error: () => {} });
  }

  deletarTarefa(id: number) {
    return this.http.delete(`${this.apiUrl}/tarefas/${id}`).pipe(
      tap(() => {
        this.tarefas.update(lista => lista.filter(t => t.id !== id));
      })
    );
  }

  carregarDiarios() {
    return this.http.get<Diario[]>(`${this.apiUrl}/diarios`).pipe(
      tap(diarios => {
        if (diarios) {
          this.diarios.set(diarios);
          if (diarios.length > 0) {
            this.ultimoDiario.set(diarios[0].conteudo);
          }
        }
      })
    );
  }

  salvarDiario(titulo: string, conteudo: string, usuarioId: number = 1) {
    return this.http.post<Diario>(`${this.apiUrl}/diarios`, {
      titulo,
      conteudo,
      usuarioId
    }).pipe(
      tap(novo => {
        this.ultimoDiario.set(novo.conteudo);
        this.diarios.update(lista => [novo, ...lista]);
      })
    );
  }

  deletarDiario(id: number) {
    return this.http.delete(`${this.apiUrl}/diarios/${id}`).pipe(
      tap(() => {
        this.diarios.update(lista => lista.filter(d => d.id !== id));
      })
    );
  }
}
