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
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { VeiculoService, VeiculoRequest, VeiculoResponse } from '../../core/services/veiculo';
import { ProprietarioService, ProprietarioResponse } from '../../core/services/proprietario';
import { extractErrorMessage } from '../../core/utils/error-handler';
import { AuthService } from '../../core/services/auth';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-veiculos',
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
    TagModule,
    IconFieldModule,
    InputIconModule,
    NgxMaskDirective
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './veiculos.html',
  styleUrl: './veiculos.scss',
})
export class Veiculos implements OnInit {

  @ViewChild('dt') dt!: Table;

  veiculos: VeiculoResponse[] = [];
  proprietarios: ProprietarioResponse[] = [];
  dialogVisivel = false;
  proprietarioSelecionadoId: number | null = null;

  form: VeiculoRequest = {
    modelo: '',
    marca: '',
    placa: '',
    vaga: 0
  };

  constructor(
    private veiculoService: VeiculoService,
    private proprietarioService: ProprietarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.carregarProprietarios();
  }

  carregar(): void {
    this.veiculoService.listarTodos().subscribe({
      next: (data) => {
        this.veiculos = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: extractErrorMessage(err, 'Erro ao carregar veículos.')
      })
    });
  }

  carregarProprietarios(): void {
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
    this.form = { modelo: '', marca: '', placa: '', vaga: 0 };
    this.proprietarioSelecionadoId = null;
    this.dialogVisivel = true;
  }

  salvar(): void {
    if (!this.proprietarioSelecionadoId) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Selecione um proprietário.' });
      return;
    }

    // Converte placa para maiúsculas antes de enviar
    this.form.placa = this.form.placa.toUpperCase();

    this.veiculoService.cadastrar(this.proprietarioSelecionadoId, this.form).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Veículo cadastrado.' });
        this.dialogVisivel = false;
        this.carregar();
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: extractErrorMessage(err, 'Erro ao cadastrar veículo.')
      })
    });
  }

  confirmarDelete(veiculo: VeiculoResponse): void {
    this.confirmationService.confirm({
      message: `Deseja excluir o veículo ${veiculo.placa}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.veiculoService.deletar(veiculo.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Veículo excluído.' });
            this.carregar();
          },
          error: (err) => this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: extractErrorMessage(err, 'Erro ao excluir veículo.')
          })
        });
      }
    });
  }

  getSeverity(status: string): 'success' | 'danger' | 'info' | 'warn' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'ATIVO': return 'success';
      case 'EXPIRADO': return 'danger';
      default: return 'info';
    }
  }
}