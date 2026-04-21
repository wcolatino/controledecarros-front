import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LogResponse {
  id: number;
  acao: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entidade: string;
  entidadeId: number;
  usuarioLogin: string;
  dataHora: string;
  detalhes: string;
}

@Injectable({
  providedIn: 'root',
})
export class LogService {

  private apiUrl = 'http://localhost:8080/logs';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<LogResponse[]> {
    return this.http.get<LogResponse[]>(this.apiUrl);
  }

  listarPorUsuario(login: string): Observable<LogResponse[]> {
    return this.http.get<LogResponse[]>(`${this.apiUrl}/usuario/${login}`);
  }

  listarPorEntidade(entidade: string): Observable<LogResponse[]> {
    return this.http.get<LogResponse[]>(`${this.apiUrl}/entidade/${entidade}`);
  }

  listarPorAcao(acao: string): Observable<LogResponse[]> {
    return this.http.get<LogResponse[]>(`${this.apiUrl}/acao/${acao}`);
  }
}