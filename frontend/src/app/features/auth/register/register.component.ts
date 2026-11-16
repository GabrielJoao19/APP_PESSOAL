import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public nome = signal('');
  public email = signal('');
  public senha = signal('');
  public carregando = signal(false);
  public mensagemErro = signal('');

  cadastrar() {
    this.carregando.set(true);
    this.mensagemErro.set('');

    this.authService.cadastrar(this.nome(), this.email(), this.senha()).subscribe({
      next: () => {
        // Auto-login após o cadastro
        this.authService.login(this.email(), this.senha()).subscribe({
          next: () => {
            this.carregando.set(false);
            this.router.navigate(['/']);
          },
          error: () => {
            this.carregando.set(false);
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.carregando.set(false);
        this.mensagemErro.set(err.error?.message || 'Erro ao realizar cadastro.');
      }
    });
  }
}
