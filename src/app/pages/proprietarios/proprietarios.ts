import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProprietarioService, ProprietarioRequest, ProprietarioResponse } from '../../core/services/proprietario';
import { extractErrorMessage } from '../../core/utils/error-handler';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-proprietarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    NgxMaskDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './proprietarios.html',
  styleUrl: './proprietarios.scss',
})
export class Proprietarios implements OnInit {

  @ViewChild('dt') dt!: Table;

  proprietarios: ProprietarioResponse[] = [];
  dialogVisivel = false;
  editando = false;
  idEditando: number | null = null;
  termoBusca = '';

  form: ProprietarioRequest = {
    nome: '',
    unidade: '',
    bloco: 'A',
    telefone: ''
  };

  blocos = [
    { label: 'Bloco A', value: 'A' },
    { label: 'Bloco B', value: 'B' }
  ];

  constructor(
    private proprietarioService: ProprietarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.proprietarioService.listarTodos().subscribe({
      next: (data) => {
        this.proprietarios = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: extractErrorMessage(err, 'Erro ao carregar proprietários.')
      })
    });
  }

  buscar(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(valor, 'contains');
  }

  abrirNovo(): void {
    this.editando = false;
    this.idEditando = null;
    this.form = { nome: '', unidade: '', bloco: 'A', telefone: '' };
    this.dialogVisivel = true;
  }

  abrirEdicao(proprietario: ProprietarioResponse): void {
    this.editando = true;
    this.idEditando = proprietario.id;
    this.form = {
      nome: proprietario.nome,
      unidade: proprietario.unidade,
      bloco: proprietario.bloco,
      telefone: proprietario.telefone
    };
    this.dialogVisivel = true;
  }

  salvar(): void {
    if (this.editando && this.idEditando) {
      this.proprietarioService.atualizar(this.idEditando, this.form).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Proprietário atualizado.' });
          this.dialogVisivel = false;
          this.carregar();
        },
        error: (err) => this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: extractErrorMessage(err, 'Erro ao atualizar proprietário.')
        })
      });
    } else {
      this.proprietarioService.cadastrar(this.form).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Proprietário cadastrado.' });
          this.dialogVisivel = false;
          this.carregar();
        },
        error: (err) => this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: extractErrorMessage(err, 'Erro ao cadastrar proprietário.')
        })
      });
    }
  }

  confirmarDelete(proprietario: ProprietarioResponse): void {
    this.confirmationService.confirm({
      message: `Deseja excluir o proprietário ${proprietario.nome}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.proprietarioService.deletar(proprietario.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Proprietário excluído.' });
            this.carregar();
          },
          error: (err) => this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: extractErrorMessage(err, 'Erro ao excluir proprietário.')
          })
        });
      }
    });
  }
}