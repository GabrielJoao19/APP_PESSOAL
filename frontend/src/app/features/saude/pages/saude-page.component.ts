import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaudeService } from '../services/saude.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-saude-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-8 max-w-5xl mx-auto flex flex-col gap-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-[#111827]">Saúde &amp; Performance Física</h2>
          <p class="text-xs text-[#6B7280] mt-1">Monitore seu peso, metas corporais e evolução física.</p>
        </div>

        <!-- Registro Rápido de Peso -->
        <div class="flex items-center gap-2 bg-white border border-[#E5E7EB] p-2.5 rounded-xl">
          <span class="text-xs font-semibold text-gray-600 pl-2">Nova Pesagem (kg):</span>
          <input type="number" step="0.1" [(ngModel)]="novoPeso" placeholder="Ex: 77.8"
                 class="w-24 px-2.5 py-1.5 text-xs bg-[#FAFAFA] border border-gray-200 rounded-lg focus:outline-none" />
          <button (click)="registrarPesagem()" [disabled]="!novoPeso()"
                  class="bg-[#10B981] hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer">
            Registrar
          </button>
        </div>
      </div>

      <!-- Metas Fitness -->
      <div class="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-[#111827]">Metas Físicas Ativas</h3>
          <button (click)="mostrarFormMeta.set(!mostrarFormMeta())"
                  class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-3 py-1.5 rounded-lg cursor-pointer">
            {{ mostrarFormMeta() ? 'Fechar' : '+ Nova Meta Física' }}
          </button>
        </div>

        @if (mostrarFormMeta()) {
          <div class="p-4 bg-[#FAFAFA] border border-gray-200 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3">
            <input [(ngModel)]="metaNome" placeholder="Meta (ex: Emagrecimento, Corrida)"
                   class="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg" />
            <input [(ngModel)]="metaUnidade" placeholder="Unidade (ex: kg, km)"
                   class="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg" />
            <input type="number" step="0.1" [(ngModel)]="metaAtual" placeholder="Valor Atual (ex: 78.5)"
                   class="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg" />
            <div class="flex gap-2">
              <input type="number" step="0.1" [(ngModel)]="metaAlvo" placeholder="Alvo (ex: 72.0)"
                     class="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg" />
              <button (click)="criarMeta()" [disabled]="!metaNome().trim() || !metaAlvo()"
                      class="bg-black text-white text-xs px-4 py-2 rounded-lg disabled:opacity-40 cursor-pointer font-medium">
                Salvar
              </button>
            </div>
          </div>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (meta of saudeService.metas(); track meta.id) {
            <div class="p-4 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] flex flex-col gap-2 group">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-sm text-[#111827]">{{ meta.nome }}</span>
                <button (click)="removerMeta(meta.id)"
                        class="text-xs text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 cursor-pointer">
                  ✕
                </button>
              </div>
              <div class="flex justify-between text-xs text-[#6B7280]">
                <span>Atual: <strong class="text-gray-900">{{ meta.valor_atual }} {{ meta.unidade }}</strong></span>
                <span>Alvo: <strong class="text-[#10B981]">{{ meta.valor_alvo }} {{ meta.unidade }}</strong></span>
              </div>
            </div>
          } @empty {
            <div class="col-span-full p-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
              Nenhuma meta física cadastrada ainda.
            </div>
          }
        </div>
      </div>

      <!-- Histórico de Pesagens -->
      <div class="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-4">
        <h3 class="text-base font-semibold text-[#111827]">Histórico de Registros ({{ saudeService.historico().length }})</h3>
        <div class="divide-y divide-[#E5E7EB]">
          @for (reg of saudeService.historico(); track reg.id) {
            <div class="py-3 flex justify-between items-center text-sm">
              <span class="font-semibold text-[#111827]">{{ reg.valor_registrado | number:'1.1-1' }} kg</span>
              <span class="text-xs text-[#6B7280]">
                {{ reg.data_registro ? (reg.data_registro | date:'dd/MM/yyyy HH:mm') : 'Registro salvo' }}
              </span>
            </div>
          } @empty {
            <div class="py-6 text-center text-xs text-gray-400">
              Nenhum registro no histórico ainda.
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class SaudePageComponent implements OnInit {
  saudeService = inject(SaudeService);
  authService = inject(AuthService);

  public novoPeso = signal<number | null>(null);
  public mostrarFormMeta = signal(false);
  public metaNome = signal('');
  public metaUnidade = signal('kg');
  public metaAtual = signal<number | null>(78.5);
  public metaAlvo = signal<number | null>(null);

  ngOnInit(): void {
    this.saudeService.carregarMetas().subscribe({ error: () => {} });
    this.saudeService.carregarHistorico().subscribe({ error: () => {} });
  }

  registrarPesagem() {
    const val = Number(this.novoPeso());
    if (!val || val <= 0) return;
    this.saudeService.atualizarPeso(val).subscribe({
      next: () => this.novoPeso.set(null)
    });
  }

  criarMeta() {
    if (!this.metaNome().trim() || !this.metaAlvo()) return;
    const userId = this.authService.currentUser()?.id || 1;
    this.saudeService
      .criarMeta(
        this.metaNome().trim(),
        this.metaUnidade() || 'kg',
        Number(this.metaAtual()) || 0,
        Number(this.metaAlvo()),
        userId
      )
      .subscribe({
        next: () => {
          this.metaNome.set('');
          this.metaAlvo.set(null);
          this.mostrarFormMeta.set(false);
        }
      });
  }

  removerMeta(id: number) {
    this.saudeService.deletarMeta(id).subscribe();
  }
}
