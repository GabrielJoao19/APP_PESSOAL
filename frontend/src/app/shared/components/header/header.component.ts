import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private authService = inject(AuthService);

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
}
