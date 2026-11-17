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
  public mostrarFormGasto = signal(false);

  public novoNome = signal('');
  public novoLimite = signal<number | null>(null);

  public gastoDescricao = signal('');
  public gastoValor = signal<number | null>(null);
  public gastoEnvelopeId = signal<number | null>(null);

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

  abrirLancamentoGasto(envelopeId?: number) {
    const padrao = envelopeId || this.financasService.envelopes()[0]?.id || null;
    this.gastoEnvelopeId.set(padrao);
    this.mostrarFormGasto.set(!this.mostrarFormGasto());
    this.mostrarFormulario.set(false);
  }

  salvarGasto() {
    const envId = Number(this.gastoEnvelopeId());
    const val = Number(this.gastoValor());
    if (!this.gastoDescricao().trim() || !val || !envId) return;

    const user = this.authService.currentUser();
    const userId = user?.id || 1;

    this.financasService.adicionarGasto(this.gastoDescricao().trim(), val, envId, userId).subscribe({
      next: () => {
        this.gastoDescricao.set('');
        this.gastoValor.set(null);
        this.mostrarFormGasto.set(false);
      }
    });
  }

  removerEnvelope(id: number, event: Event) {
    event.stopPropagation();
    this.financasService.deletarEnvelope(id).subscribe();
  }
}
