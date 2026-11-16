import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancasService } from '../../financas/services/financas.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-envelopes-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './envelopes-widget.component.html',
})
export class EnvelopesWidgetComponent {
  financasService = inject(FinancasService);
  authService = inject(AuthService);

  public mostrarFormulario = signal(false);
  public novoNome = signal('');
  public novoLimite = signal<number | null>(null);

  salvarEnvelope() {
    if (!this.novoNome() || !this.novoLimite()) return;

    const user = this.authService.currentUser();
    const userId = user?.id || 1;

    this.financasService.criarEnvelope(this.novoNome(), Number(this.novoLimite()), userId).subscribe({
      next: () => {
        this.novoNome.set('');
        this.novoLimite.set(null);
        this.mostrarFormulario.set(false);
      }
    });
  }
}
