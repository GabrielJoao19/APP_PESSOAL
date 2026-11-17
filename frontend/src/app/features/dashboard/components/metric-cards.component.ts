import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaudeService } from '../../saude/services/saude.service';
import { FinancasService } from '../../financas/services/financas.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-metric-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metric-cards.component.html',
})
export class MetricCardsComponent {
  saudeService = inject(SaudeService);
  financasService = inject(FinancasService);
  authService = inject(AuthService);

  public editandoPeso = signal(false);
  public novoPesoInput = signal<number | null>(null);

  public limiteDiario = computed(() => this.authService.currentUser()?.limite_diario ?? 50);

  public saldoDiarioDisponivel = computed(() => {
    return this.limiteDiario() - this.financasService.gastoHoje();
  });

  abrirEdicaoPeso() {
    this.novoPesoInput.set(this.saudeService.pesoAtual());
    this.editandoPeso.set(true);
  }

  salvarPeso() {
    const val = Number(this.novoPesoInput());
    if (!val || val <= 0) return;
    this.saudeService.atualizarPeso(val).subscribe({
      next: () => this.editandoPeso.set(false),
      error: () => this.editandoPeso.set(false)
    });
  }
}
