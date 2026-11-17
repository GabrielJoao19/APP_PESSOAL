import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancasService } from '../../financas/services/financas.service';

@Component({
  selector: 'app-monthly-summary-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-summary-widget.component.html',
})
export class MonthlySummaryWidgetComponent {
  financasService = inject(FinancasService);

  public percentualOrcamento = computed(() => {
    const limite = this.financasService.totalOrcamentoMes();
    const gasto = this.financasService.totalGastoMes();
    if (limite <= 0) return 0;
    return Math.min(100, Math.round((gasto / limite) * 100));
  });
}
