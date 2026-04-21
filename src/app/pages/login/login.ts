import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService, AuthRequest } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  form: AuthRequest = {
    login: '',
    senha: ''
  };

  carregando = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  entrar(): void {
    if (!this.form.login || !this.form.senha) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha login e senha.' });
      return;
    }

    this.carregando = true;

    this.authService.login(this.form).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.carregando = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Login ou senha inválidos.' });
      }
    });
  }
}