import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancasService } from '../services/financas.service';
import { AuthService } from '../../../core/services/auth.service';
import { EnvelopesWidgetComponent } from '../../dashboard/components/envelopes-widget.component';

@Component({
  selector: 'app-financas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, EnvelopesWidgetComponent],
  template: `
    <div class="p-6 md:p-8 max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <h2 class="text-xl font-bold text-[#111827]">Gestão Financeira &amp; Investimentos</h2>
        <p class="text-xs text-[#6B7280] mt-1">Controle envelopes de orçamento, extrato de gastos e sua carteira de investimentos.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Coluna 1: Envelopes -->
        <div class="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <app-envelopes-widget />
        </div>

        <!-- Coluna 2: Extrato de Gastos -->
        <div class="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h3 class="text-base font-semibold text-[#111827]">Extrato de Gastos ({{ financasService.gastos().length }})</h3>
            <span class="text-xs font-semibold text-gray-600">
              Total Gasto: R$ {{ financasService.totalGastoMes() | number:'1.2-2' }}
            </span>
          </div>

          <div class="divide-y divide-[#E5E7EB] max-h-[360px] overflow-y-auto">
            @for (gasto of financasService.gastos(); track gasto.id) {
              <div class="py-3 flex justify-between items-center group">
                <div>
                  <div class="text-sm font-medium text-[#111827]">{{ gasto.descricao }}</div>
                  @if (gasto.criadoEm) {
                    <div class="text-xs text-[#6B7280]">{{ gasto.criadoEm | date:'dd/MM/yyyy HH:mm' }}</div>
                  }
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-bold text-[#EF4444]">- R$ {{ gasto.valor | number:'1.2-2' }}</span>
                  <button (click)="removerGasto(gasto.id)"
                          class="text-xs text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 cursor-pointer">
                    ✕
                  </button>
                </div>
              </div>
            } @empty {
              <div class="py-8 text-center text-xs text-gray-400">
                Nenhum gasto registrado ainda. Use o botão "+ Gasto" nos envelopes ao lado!
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Carteira de Investimentos -->
      <div class="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <h3 class="text-base font-semibold text-[#111827]">Carteira de Investimentos</h3>
          <button (click)="mostrarFormInv.set(!mostrarFormInv())"
                  class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-3 py-1.5 rounded-lg cursor-pointer">
            {{ mostrarFormInv() ? 'Fechar' : '+ Novo Ativo' }}
          </button>
        </div>

        @if (mostrarFormInv()) {
          <div class="p-4 bg-[#FAFAFA] border border-gray-200 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3">
            <input [(ngModel)]="invNome" placeholder="Ativo (ex: Tesouro Selic, Bitcoin)"
                   class="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg" />
            <select [(ngModel)]="invCategoria" class="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg">
              <option value="RENDA_FIXA">Renda Fixa</option>
              <option value="ACAO">Ações / FIIs</option>
              <option value="CRIPTOMOEDA">Criptomoeda</option>
            </select>
            <input type="number" [(ngModel)]="invValorInvestido" placeholder="Valor Investido R$"
                   class="px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg" />
            <div class="flex gap-2">
              <input type="number" [(ngModel)]="invValorAtual" placeholder="Valor Atual R$"
                     class="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg" />
              <button (click)="salvarInvestimento()" [disabled]="!invNome().trim() || !invValorInvestido()"
                      class="bg-black text-white text-xs px-4 py-2 rounded-lg disabled:opacity-40 cursor-pointer font-medium">
                Salvar
              </button>
            </div>
          </div>
        }

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (inv of financasService.investimentos(); track inv.id) {
            <div class="p-4 border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] flex flex-col gap-2 group">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-sm text-[#111827]">{{ inv.nome }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700">{{ inv.tipo }}</span>
                  <button (click)="removerInvestimento(inv.id)"
                          class="text-xs text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 cursor-pointer">
                    ✕
                  </button>
                </div>
              </div>
              <div class="flex justify-between text-xs text-[#6B7280] mt-1">
                <span>Investido: R$ {{ inv.valor_investido | number:'1.2-2' }}</span>
                <span class="font-bold text-[#10B981]">Atual: R$ {{ inv.valor_atual | number:'1.2-2' }}</span>
              </div>
            </div>
          } @empty {
            <div class="col-span-full py-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
              Nenhum ativo cadastrado na carteira ainda.
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class FinancasPageComponent implements OnInit {
  financasService = inject(FinancasService);
  authService = inject(AuthService);

  public mostrarFormInv = signal(false);
  public invNome = signal('');
  public invCategoria = signal('RENDA_FIXA');
  public invValorInvestido = signal<number | null>(null);
  public invValorAtual = signal<number | null>(null);

  ngOnInit(): void {
    this.financasService.carregarEnvelopes().subscribe({ error: () => {} });
    this.financasService.carregarGastos().subscribe({ error: () => {} });
    this.financasService.carregarInvestimentos().subscribe({ error: () => {} });
    this.financasService.carregarTiposInvestimento().subscribe({ error: () => {} });
  }

  removerGasto(id: number) {
    this.financasService.deletarGasto(id).subscribe();
  }

  salvarInvestimento() {
    if (!this.invNome().trim() || !this.invValorInvestido()) return;
    const userId = this.authService.currentUser()?.id || 1;
    const investido = Number(this.invValorInvestido());
    const atual = Number(this.invValorAtual()) || investido;
    const tipos = this.financasService.tiposInvestimento();

    if (tipos.length > 0) {
      this.financasService
        .criarInvestimento(this.invNome().trim(), this.invCategoria(), investido, atual, tipos[0].id, userId)
        .subscribe({ next: () => this.limparFormInv() });
    } else {
      this.financasService.criarTipoInvestimento('Padrão', 100, 'Imediato').subscribe({
        next: novoTipo => {
          this.financasService
            .criarInvestimento(this.invNome().trim(), this.invCategoria(), investido, atual, novoTipo.id, userId)
            .subscribe({ next: () => this.limparFormInv() });
        }
      });
    }
  }

  private limparFormInv() {
    this.invNome.set('');
    this.invValorInvestido.set(null);
    this.invValorAtual.set(null);
    this.mostrarFormInv.set(false);
  }

  removerInvestimento(id: number) {
    this.financasService.deletarInvestimento(id).subscribe();
  }
}
