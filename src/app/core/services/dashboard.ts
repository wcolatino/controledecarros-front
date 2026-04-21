import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardResumo {
  totalCadastrados: number;
  totalAtivos: number;
  totalExpirados: number;
  totalAVencer: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getResumo(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(`${this.apiUrl}/dashboard/resumo`);
  }
}