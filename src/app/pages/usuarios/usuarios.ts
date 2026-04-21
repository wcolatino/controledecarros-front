import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { UsuarioService, UsuarioRequest, UsuarioResponse } from '../../core/services/usuario';
import { extractErrorMessage } from '../../core/utils/error-handler';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    ToastModule,
    TableModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {

  usuarios: UsuarioResponse[] = [];
  dialogVisivel = false;

  form: UsuarioRequest = {
    login: '',
    senha: '',
    role: 'PORTARIA'
  };

  roles = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Portaria', value: 'PORTARIA' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.usuarioService.listarTodos().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: extractErrorMessage(err, 'Erro ao carregar usuários.')
      })
    });
  }

  abrirNovo(): void {
    this.form = { login: '', senha: '', role: 'PORTARIA' };
    this.dialogVisivel = true;
  }

  salvar(): void {
    if (!this.form.login || !this.form.senha) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha login e senha.' });
      return;
    }

    this.usuarioService.cadastrar(this.form).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário cadastrado com sucesso.' });
        this.dialogVisivel = false;
        this.carregar();
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: extractErrorMessage(err, 'Erro ao cadastrar usuário.')
      })
    });
  }

  getSeverityRole(role: string): 'success' | 'danger' | 'info' | 'warn' | 'secondary' | 'contrast' | undefined {
    return role === 'ADMIN' ? 'info' : 'secondary';
  }

  getLabelRole(role: string): string {
    return role === 'ADMIN' ? 'Administrador' : 'Portaria';
  }
}