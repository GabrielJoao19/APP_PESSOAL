import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardsComponent } from './components/metric-cards.component';
import { EnvelopesWidgetComponent } from './components/envelopes-widget.component';
import { DailyScoreWidgetComponent } from './components/daily-score-widget.component';
import { MonthlySummaryWidgetComponent } from './components/monthly-summary-widget.component';
import { HabitsWidgetComponent } from './components/habits-widget.component';
import { MistakesWidgetComponent } from './components/mistakes-widget.component';
import { JournalWidgetComponent } from './components/journal-widget.component';
import { PerformanceCalendarWidgetComponent } from './components/performance-calendar-widget.component';
import { FinancasService } from '../financas/services/financas.service';
import { ProdutividadeService } from '../produtividade/services/produtividade.service';
import { FalhasService } from '../falhas/services/falhas.service';
import { SaudeService } from '../saude/services/saude.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MetricCardsComponent,
    EnvelopesWidgetComponent,
    DailyScoreWidgetComponent,
    MonthlySummaryWidgetComponent,
    HabitsWidgetComponent,
    MistakesWidgetComponent,
    JournalWidgetComponent,
    PerformanceCalendarWidgetComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private financasService = inject(FinancasService);
  private produtividadeService = inject(ProdutividadeService);
  private falhasService = inject(FalhasService);
  private saudeService = inject(SaudeService);

  ngOnInit(): void {
    this.carregarDadosDoBanco();
  }

  private carregarDadosDoBanco(): void {
    this.financasService.carregarEnvelopes().subscribe({ error: () => {} });
    this.financasService.carregarGastos().subscribe({ error: () => {} });
    this.financasService.carregarMetasFinanceiras().subscribe({ error: () => {} });
    this.financasService.carregarInvestimentos().subscribe({ error: () => {} });
    this.produtividadeService.carregarTarefas().subscribe({ error: () => {} });
    this.produtividadeService.carregarDiarios().subscribe({ error: () => {} });
    this.falhasService.carregarFalhas().subscribe({ error: () => {} });
    this.falhasService.carregarCategorias().subscribe({ error: () => {} });
    this.saudeService.carregarMetas().subscribe({ error: () => {} });
    this.saudeService.carregarHistorico().subscribe({ error: () => {} });
  }
}
