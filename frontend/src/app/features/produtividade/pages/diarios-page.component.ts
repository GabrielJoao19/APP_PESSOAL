import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutividadeService } from '../services/produtividade.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-diarios-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-8 max-w-5xl mx-auto flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-[#111827]">Meus Diários & Reflexões</h2>
          <p class="text-xs text-[#6B7280] mt-1">Registre aprendizados, decisões e acompanhe sua evolução diária.</p>
        </div>
      </div>

      <!-- Novo Registro -->
      <div class="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-3 shadow-2xs">
        <input [(ngModel)]="novoTitulo"
               placeholder="Título do registro (ex: Aprendizados da Semana)"
               class="px-3.5 py-2 text-sm font-medium bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-gray-500" />
        <textarea [(ngModel)]="novoConteudo"
                  placeholder="Escreva suas notas, reflexões ou check-in do dia..."
                  class="w-full min-h-[120px] p-3.5 border border-[#E5E7EB] rounded-lg bg-[#FAFAFA] text-[#111827] text-sm resize-y focus:outline-none focus:border-gray-500"></textarea>
        <div class="flex justify-between items-center">
          <span class="text-xs text-emerald-600 font-medium">{{ feedback() }}</span>
          <button (click)="salvar()" [disabled]="!novoConteudo().trim()"
                  class="bg-black hover:bg-gray-800 disabled:opacity-40 text-white text-xs font-medium px-5 py-2.5 rounded-lg cursor-pointer transition-colors">
            Salvar no Diário
          </button>
        </div>
      </div>

      <!-- Lista de Diários Salvos -->
      <div class="flex flex-col gap-4">
        <h3 class="text-sm font-semibold text-[#111827] uppercase tracking-wider">Histórico de Registros ({{ produtividadeService.diarios().length }})</h3>
        @for (item of produtividadeService.diarios(); track item.id) {
          <div class="bg-white border border-[#E5E7EB] rounded-xl p-5 flex justify-between items-start gap-4 group">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h4 class="font-semibold text-base text-[#111827]">{{ item.titulo }}</h4>
                @if (item.criadoEm) {
                  <span class="text-xs text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded">{{ item.criadoEm | date:'dd/MM/yyyy HH:mm' }}</span>
                }
              </div>
              <p class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{{ item.conteudo }}</p>
            </div>
            <button (click)="excluir(item.id)"
                    class="text-xs text-gray-400 hover:text-red-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              Excluir
            </button>
          </div>
        } @empty {
          <div class="p-8 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white">
            Nenhum diário registrado ainda. Escreva sua primeira nota acima!
          </div>
        }
      </div>
    </div>
  `
})
export class DiariosPageComponent implements OnInit {
  produtividadeService = inject(ProdutividadeService);
  authService = inject(AuthService);

  public novoTitulo = signal('');
  public novoConteudo = signal('');
  public feedback = signal('');

  ngOnInit(): void {
    this.produtividadeService.carregarDiarios().subscribe({ error: () => {} });
  }

  salvar() {
    if (!this.novoConteudo().trim()) return;
    const user = this.authService.currentUser();
    const userId = user?.id || 1;
    const titulo = this.novoTitulo().trim() || `Registro de ${new Date().toLocaleDateString('pt-BR')}`;

    this.produtividadeService.salvarDiario(titulo, this.novoConteudo().trim(), userId).subscribe({
      next: () => {
        this.novoTitulo.set('');
        this.novoConteudo.set('');
        this.feedback.set('Registro salvo com sucesso!');
        setTimeout(() => this.feedback.set(''), 3000);
      }
    });
  }

  excluir(id: number) {
    this.produtividadeService.deletarDiario(id).subscribe();
  }
}
