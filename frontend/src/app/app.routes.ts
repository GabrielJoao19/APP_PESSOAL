import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './shared/components/layout/dashboard-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DiariosPageComponent } from './features/produtividade/pages/diarios-page.component';
import { SaudePageComponent } from './features/saude/pages/saude-page.component';
import { FinancasPageComponent } from './features/financas/pages/financas-page.component';
import { MetasPageComponent } from './features/financas/pages/metas-page.component';
import { ConfiguracoesPageComponent } from './features/configuracoes/pages/configuracoes-page.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rotas públicas (só entram se NÃO estiver logado)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'cadastro',
    component: RegisterComponent,
    canActivate: [guestGuard]
  },

  // Rotas protegidas (só entram se ESTIVER logado)
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'financas', component: FinancasPageComponent },
      { path: 'saude', component: SaudePageComponent },
      { path: 'diarios', component: DiariosPageComponent },
      { path: 'metas', component: MetasPageComponent },
      { path: 'configuracoes', component: ConfiguracoesPageComponent }
    ]
  },

  // Qualquer URL inválida vai pra raiz (que o authGuard vai tratar)
  {
    path: '**',
    redirectTo: ''
  }
];
