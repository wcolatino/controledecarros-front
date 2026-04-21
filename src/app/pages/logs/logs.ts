import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { LogService, LogResponse } from '../../core/services/log';
import { extractErrorMessage } from '../../core/utils/error-handler';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    ToastModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './logs.html',
  styleUrl: './logs.scss',
})
export class Logs implements OnInit {

  logs: LogResponse[] = [];

  acoes = [
    { label: 'Todas', value: null },
    { label: 'Cadastro', value: 'CREATE' },
    { label: 'Atualização', value: 'UPDATE' },
    { label: 'Exclusão', value: 'DELETE' },
    { label: 'Consulta', value: 'READ' }
  ];

  entidades = [
    { label: 'Todas', value: null },
    { label: 'Proprietário', value: 'Proprietario' },
    { label: 'Veículo', value: 'Veiculo' }
  ];

  acaoSelecionada: string | null = null;
  entidadeSelecionada: string | null = null;

  constructor(
    private logService: LogService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.logService.listarTodos().subscribe({
      next: (data) => {
        this.logs = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: extractErrorMessage(err, 'Erro ao carregar logs.')
      })
    });
  }

  filtrarPorAcao(): void {
    if (!this.acaoSelecionada) {
      this.carregar();
      return;
    }
    this.logService.listarPorAcao(this.acaoSelecionada).subscribe({
      next: (data) => {
        this.logs = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: extractErrorMessage(err, 'Erro ao filtrar logs.')
      })
    });
  }

  filtrarPorEntidade(): void {
    if (!this.entidadeSelecionada) {
      this.carregar();
      return;
    }
    this.logService.listarPorEntidade(this.entidadeSelecionada).subscribe({
      next: (data) => {
        this.logs = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: extractErrorMessage(err, 'Erro ao filtrar logs.')
      })
    });
  }

  getSeverityAcao(acao: string): 'success' | 'danger' | 'info' | 'warn' | 'secondary' | 'contrast' | undefined {
    switch (acao) {
      case 'CREATE': return 'success';
      case 'UPDATE': return 'info';
      case 'DELETE': return 'danger';
      case 'READ': return 'secondary';
      default: return 'info';
    }
  }

  getLabelAcao(acao: string): string {
    switch (acao) {
      case 'CREATE': return 'Cadastro';
      case 'UPDATE': return 'Atualização';
      case 'DELETE': return 'Exclusão';
      case 'READ': return 'Consulta';
      default: return acao;
    }
  }
}