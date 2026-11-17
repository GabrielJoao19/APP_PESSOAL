import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancasService } from '../services/financas.service';
import { AuthService } from '../../../core/services/auth.service';
import { HabitsWidgetComponent } from '../../dashboard/components/habits-widget.component';

@Component({
  selector: 'app-metas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HabitsWidgetComponent],
  template: `
    <div class="p-6 md:p-8 max-w-5xl mx-auto flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-[#111827]">Metas do Mês &amp; Objetivos Financeiros</h2>
          <p class="text-xs text-[#6B7280] mt-1">Acompanhe o progresso das suas metas financeiras e hábitos diários.</p>
        </div>
        <button (click)="mostrarForm.set(!mostrarForm())"
                class="text-xs bg-black text-white font-medium px-3.5 py-2 rounded-lg cursor-pointer">
          {{ mostrarForm() ? 'Fechar' : '+ Nova Meta Financeira' }}
        </button>
      </div>

      @if (mostrarForm()) {
        <div class="bg-white border border-[#E5E7EB] rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input [(ngModel)]="novoNome" placeholder="Objetivo (ex: Reserva de Emergência, Viagem)"
                 class="px-3 py-2 text-xs bg-[#FAFAFA] border border-gray-200 rounded-lg" />
          <input type="number" [(ngModel)]="novoAlvo" placeholder="Valor Alvo R$ (ex: 10000)"
                 class="px-3 py-2 text-xs bg-[#FAFAFA] border border-gray-200 rounded-lg" />
          <div class="flex gap-2">
            <input type="number" [(ngModel)]="novoAtual" placeholder="Já guardado R$ (ex: 1500)"
                   class="flex-1 px-3 py-2 text-xs bg-[#FAFAFA] border border-gray-200 rounded-lg" />
            <button (click)="criarMeta()" [disabled]="!novoNome().trim() || !novoAlvo()"
                    class="bg-[#10B981] text-white text-xs px-4 py-2 rounded-lg disabled:opacity-40 cursor-pointer font-medium">
              Salvar
            </button>
          </div>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (meta of financasService.metasFinanceiras(); track meta.id) {
          @let pct = meta.valor_alvo > 0 ? (meta.valor_atual / meta.valor_alvo) * 100 : 0;
          <div class="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-3 group">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-base text-[#111827]">{{ meta.nome }}</span>
              <div class="flex items-center gap-2">
                <button (click)="aportarCemReais(meta.id, meta.valor_atual)"
                        class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded cursor-pointer">
                  + R$ 100
                </button>
                <button (click)="removerMeta(meta.id)"
                        class="text-xs text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 cursor-pointer">
                  ✕
                </button>
              </div>
            </div>

            <div class="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div class="h-full bg-[#10B981] transition-all duration-300" [style.width.%]="pct > 100 ? 100 : pct"></div>
            </div>

            <div class="flex justify-between text-xs text-[#6B7280]">
              <span>Acumulado: <strong class="text-gray-900">R$ {{ meta.valor_atual | number:'1.2-2' }}</strong></span>
              <span>Meta: <strong class="text-[#10B981]">R$ {{ meta.valor_alvo | number:'1.2-2' }} ({{ pct | number:'1.0-0' }}%)</strong></span>
            </div>
          </div>
        } @empty {
          <div class="col-span-full p-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white">
            Nenhuma meta financeira cadastrada ainda. Clique em "+ Nova Meta Financeira" acima!
          </div>
        }
      </div>

      <!-- Hábitos / Conquistas do Mês -->
      <div class="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <app-habits-widget />
      </div>
    </div>
  `
})
export class MetasPageComponent implements OnInit {
  financasService = inject(FinancasService);
  authService = inject(AuthService);

  public mostrarForm = signal(false);
  public novoNome = signal('');
  public novoAlvo = signal<number | null>(null);
  public novoAtual = signal<number | null>(0);

  ngOnInit(): void {
    this.financasService.carregarMetasFinanceiras().subscribe({ error: () => {} });
  }

  criarMeta() {
    if (!this.novoNome().trim() || !this.novoAlvo()) return;
    const userId = this.authService.currentUser()?.id || 1;
    this.financasService
      .criarMetaFinanceira(this.novoNome().trim(), Number(this.novoAlvo()), Number(this.novoAtual()) || 0, userId)
      .subscribe({
        next: () => {
          this.novoNome.set('');
          this.novoAlvo.set(null);
          this.novoAtual.set(0);
          this.mostrarForm.set(false);
        }
      });
  }

  aportarCemReais(id: number, valorAtual: number) {
    this.financasService.atualizarMetaFinanceira(id, (valorAtual || 0) + 100).subscribe();
  }

  removerMeta(id: number) {
    this.financasService.deletarMetaFinanceira(id).subscribe();
  }
}
