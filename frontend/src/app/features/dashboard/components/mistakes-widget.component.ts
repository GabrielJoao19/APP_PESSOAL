import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FalhasService } from '../../falhas/services/falhas.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mistakes-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mistakes-widget.component.html',
})
export class MistakesWidgetComponent {
  falhasService = inject(FalhasService);
  authService = inject(AuthService);

  public mostrarInput = signal(false);
  public novaDescricao = signal('');
  public novaPenalidade = signal<number>(15);

  adicionarFalha() {
    if (!this.novaDescricao().trim()) return;
    const user = this.authService.currentUser();
    const userId = user?.id || 1;
    const catId = this.falhasService.categorias()[0]?.id || 1;

    this.falhasService
      .registrarFalha(this.novaDescricao().trim(), Number(this.novaPenalidade()) || 15, catId, userId)
      .subscribe({
        next: () => {
          this.novaDescricao.set('');
          this.novaPenalidade.set(15);
          this.mostrarInput.set(false);
        }
      });
  }

  removerFalha(id: number, event: Event) {
    event.stopPropagation();
    this.falhasService.deletarFalha(id).subscribe();
  }
}
