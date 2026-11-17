import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ProdutividadeService } from '../../../features/produtividade/services/produtividade.service';
import { FalhasService } from '../../../features/falhas/services/falhas.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private produtividadeService = inject(ProdutividadeService);
  private falhasService = inject(FalhasService);

  public saudacaoNome = computed(() => {
    const user = this.authService.currentUser();
    return user?.nome ? user.nome.split(' ')[0] : 'João';
  });

  public dataFormatada = computed(() => {
    const hoje = new Date();
    const opcoes: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const str = hoje.toLocaleDateString('pt-BR', opcoes);
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  public scoreGlobal = computed(() => {
    const tarefas = this.produtividadeService.tarefas();
    const baseHabitos =
      tarefas.length === 0
        ? 100
        : Math.round((tarefas.filter(t => t.concluida).length / tarefas.length) * 100);
    const penalidades = this.falhasService
      .falhas()
      .reduce((acc, f) => acc + (f.valor_diario ?? f.penalidade ?? 0), 0);
    return Math.max(0, Math.min(100, baseHabitos - penalidades));
  });
}
