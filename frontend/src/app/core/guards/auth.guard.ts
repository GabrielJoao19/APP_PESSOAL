import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard para quem NÃO está logado: bloqueia rota e manda pro /login
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/login');
};

// Guard para a tela de Login/Cadastro: se já estiver logado, manda pro dashboard
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true; // Não está logado: pode entrar na tela de login/cadastro
  }

  return router.parseUrl('/'); // Já está logado: redireciona pro dashboard
};
