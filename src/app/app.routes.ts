import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SetoresComponent } from './pages/setores/setores.component';
import { OperadoresComponent } from './pages/operadores/operadores.component';

export const routes: Routes = [
  { path: '',           component: DashboardComponent },
  { path: 'setores',    component: SetoresComponent },
  { path: 'operadores', component: OperadoresComponent },
  { path: '**',         redirectTo: '' }
];
