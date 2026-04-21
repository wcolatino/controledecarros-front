import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DashboardService, DashboardResumo } from '../../core/services/dashboard';
import { VeiculoService, VeiculoResponse } from '../../core/services/veiculo';
import { extractErrorMessage } from '../../core/utils/error-handler';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  resumo: DashboardResumo = {
    totalCadastrados: 0,
    totalAtivos: 0,
    totalExpirados: 0,
    totalAVencer: 0
  };

  veiculos: VeiculoResponse[] = [];

  constructor(
    private dashboardService: DashboardService,
    private veiculoService: VeiculoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarVeiculos();
  }

  carregarResumo(): void {
    this.dashboardService.getResumo().subscribe({
      next: (data) => {
        this.resumo = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(extractErrorMessage(err, 'Erro ao carregar resumo.'))
    });
  }

  carregarVeiculos(): void {
    this.veiculoService.listarTodos().subscribe({
      next: (data) => {
        this.veiculos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(extractErrorMessage(err, 'Erro ao carregar veículos.'))
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