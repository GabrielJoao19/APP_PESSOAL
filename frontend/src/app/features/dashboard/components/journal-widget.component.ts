import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutividadeService } from '../../produtividade/services/produtividade.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-journal-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal-widget.component.html',
})
export class JournalWidgetComponent implements OnInit {
  produtividadeService = inject(ProdutividadeService);
  authService = inject(AuthService);

  public textoDiario = signal('');
  public salvando = signal(false);
  public mensagemSalvo = signal('');

  ngOnInit(): void {
    this.produtividadeService.carregarDiarios().subscribe({
      next: (diarios) => {
        if (diarios && diarios.length > 0) {
          this.textoDiario.set(diarios[0].conteudo);
        }
      }
    });
  }

  salvar() {
    if (!this.textoDiario().trim()) return;

    const user = this.authService.currentUser();
    const userId = user?.id || 1;
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const titulo = `Check-in de ${dataHoje}`;

    this.salvando.set(true);
    this.produtividadeService.salvarDiario(titulo, this.textoDiario().trim(), userId).subscribe({
      next: () => {
        this.salvando.set(false);
        this.mensagemSalvo.set('Salvo no PostgreSQL com sucesso!');
        setTimeout(() => this.mensagemSalvo.set(''), 3000);
      },
      error: () => {
        this.salvando.set(false);
        this.mensagemSalvo.set('Erro ao salvar no banco.');
        setTimeout(() => this.mensagemSalvo.set(''), 3000);
      }
    });
  }
}
