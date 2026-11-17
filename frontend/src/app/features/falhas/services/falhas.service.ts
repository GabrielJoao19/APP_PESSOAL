import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Falha, CategoriaFalha } from '../../../core/models/app.models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FalhasService {
  private http = inject(HttpClient);
  private apiUrl = '/api/falhas';
  private categoriasUrl = '/api/categorias-falha';

  public falhas = signal<Falha[]>([]);
  public categorias = signal<CategoriaFalha[]>([]);

  carregarFalhas() {
    return this.http.get<Falha[]>(this.apiUrl).pipe(
      tap(falhas => {
        if (falhas) {
          this.falhas.set(falhas);
        }
      })
    );
  }

  carregarCategorias() {
    return this.http.get<CategoriaFalha[]>(this.categoriasUrl).pipe(
      tap(cats => {
        if (cats) {
          this.categorias.set(cats);
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

  deletarFalha(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.falhas.update(lista => lista.filter(f => f.id !== id));
      })
    );
  }
}
