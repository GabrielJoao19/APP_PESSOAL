import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-configuracoes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 md:p-8 max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h2 class="text-xl font-bold text-[#111827]">Configurações da Conta</h2>
        <p class="text-xs text-[#6B7280] mt-1">Personalize seus dados e defina seu teto de gastos diário.</p>
      </div>

      <div class="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Nome de Exibição</label>
          <input [(ngModel)]="nome"
                 class="w-full px-3.5 py-2 text-sm bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-black" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">E-mail</label>
          <input [(ngModel)]="email" type="email"
                 class="w-full px-3.5 py-2 text-sm bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-black" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Limite de Gasto Diário (R$)</label>
          <input [(ngModel)]="limiteDiario" type="number"
                 class="w-full px-3.5 py-2 text-sm bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-black" />
        </div>

        <div class="flex justify-between items-center pt-2">
          <span class="text-xs font-medium text-emerald-600">{{ mensagem() }}</span>
          <button (click)="salvar()"
                  class="bg-black hover:bg-gray-800 text-white text-xs font-medium px-5 py-2.5 rounded-lg cursor-pointer transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfiguracoesPageComponent implements OnInit {
  authService = inject(AuthService);

  public nome = signal('');
  public email = signal('');
  public limiteDiario = signal<number>(50);
  public mensagem = signal('');

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.nome.set(user.nome || '');
      this.email.set(user.email || '');
      this.limiteDiario.set(user.limite_diario ?? 50);
    }
  }

  salvar() {
    const user = this.authService.currentUser();
    const id = user?.id || 1;
    this.authService
      .atualizarPerfil(id, {
        nome: this.nome().trim(),
        email: this.email().trim(),
        limite_diario: Number(this.limiteDiario()) || 50
      })
      .subscribe({
        next: () => {
          this.mensagem.set('Configurações salvas com sucesso!');
          setTimeout(() => this.mensagem.set(''), 3000);
        },
        error: () => {
          // Mesmo se o endpoint falhar offline, atualiza localmente para experiência fluida
          const fallback = {
            id,
            nome: this.nome().trim(),
            email: this.email().trim(),
            limite_diario: Number(this.limiteDiario()) || 50
          };
          localStorage.setItem('lifeos_user', JSON.stringify(fallback));
          this.authService.currentUser.set(fallback);
          this.mensagem.set('Configurações atualizadas!');
          setTimeout(() => this.mensagem.set(''), 3000);
        }
      });
  }
}
