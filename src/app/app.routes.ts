import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Proprietarios } from './pages/proprietarios/proprietarios';
import { Veiculos } from './pages/veiculos/veiculos';
import { Logs } from './pages/logs/logs';
import { authGuard } from './core/guards/auth-guard';
import { Usuarios } from './pages/usuarios/usuarios';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'proprietarios', component: Proprietarios },
            { path: 'veiculos', component: Veiculos },
            { path: 'logs', component: Logs },
            { path: 'usuarios', component: Usuarios }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];