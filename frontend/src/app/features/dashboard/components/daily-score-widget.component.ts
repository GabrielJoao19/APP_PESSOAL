import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutividadeService } from '../../produtividade/services/produtividade.service';
import { FalhasService } from '../../falhas/services/falhas.service';

@Component({
  selector: 'app-daily-score-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-score-widget.component.html',
})
export class DailyScoreWidgetComponent {
  produtividadeService = inject(ProdutividadeService);
  falhasService = inject(FalhasService);

  public percentualHabitos = computed(() => {
    const tarefas = this.produtividadeService.tarefas();
    if (tarefas.length === 0) return 100;
    const concluidas = tarefas.filter(t => t.concluida).length;
    return Math.round((concluidas / tarefas.length) * 100);
  });

  public totalPenalidades = computed(() => {
    const falhas = this.falhasService.falhas();
    return falhas.reduce((acc, f) => acc + (f.valor_diario ?? f.penalidade ?? 0), 0);
  });

  public scoreFinal = computed(() => {
    const base = this.percentualHabitos() - this.totalPenalidades();
    return Math.max(0, Math.min(100, base));
  });
}
