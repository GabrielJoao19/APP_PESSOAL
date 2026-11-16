import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public email = signal('');
  public senha = signal('');
  public carregando = signal(false);
  public mensagemErro = signal('');

  fazerLogin() {
    this.carregando.set(true);
    this.mensagemErro.set('');

    this.authService.login(this.email(), this.senha()).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.carregando.set(false);
        this.mensagemErro.set(err.error?.message || 'E-mail ou senha incorretos.');
      }
    });
  }
}
