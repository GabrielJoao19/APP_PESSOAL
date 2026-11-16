import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutividadeService } from '../../produtividade/services/produtividade.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-habits-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habits-widget.component.html',
})
export class HabitsWidgetComponent {
  produtividadeService = inject(ProdutividadeService);
  authService = inject(AuthService);

  public mostrarInput = signal(false);
  public novoTitulo = signal('');

  adicionarTarefa() {
    if (!this.novoTitulo().trim()) return;

    const user = this.authService.currentUser();
    const userId = user?.id || 1;

    this.produtividadeService.criarTarefa(this.novoTitulo().trim(), 15, userId).subscribe({
      next: () => {
        this.novoTitulo.set('');
        this.mostrarInput.set(false);
      }
    });
  }
}
