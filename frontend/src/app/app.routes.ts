import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './shared/components/layout/dashboard-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
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
      { path: 'financas', component: DashboardComponent },
      { path: 'saude', component: DashboardComponent },
      { path: 'diarios', component: DashboardComponent },
      { path: 'metas', component: DashboardComponent },
      { path: 'configuracoes', component: DashboardComponent }
    ]
  },

  // Qualquer URL inválida vai pra raiz (que o authGuard vai tratar)
  {
    path: '**',
    redirectTo: ''
  }
];
