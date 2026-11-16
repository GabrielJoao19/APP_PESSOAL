import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Falha } from '../../../core/models/app.models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FalhasService {
  private http = inject(HttpClient);
  private apiUrl = '/api/falhas';

  public falhas = signal<Falha[]>([]);

  carregarFalhas() {
    return this.http.get<Falha[]>(this.apiUrl).pipe(
      tap(falhas => {
        if (falhas) {
          this.falhas.set(falhas);
        }
      })
    );
  }

  registrarFalha(descricao: string, valor_diario: number = 15, categoriaId: number = 1, usuarioId: number = 1) {
    return this.http.post<Falha>(this.apiUrl, {
      descricao,
      valor_diario,
      categoriaId,
      usuarioId
    }).pipe(
      tap(nova => {
        this.falhas.update(lista => [nova, ...lista]);
      })
    );
  }
}
