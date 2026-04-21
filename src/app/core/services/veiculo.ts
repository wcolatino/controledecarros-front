import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VeiculoRequest {
  modelo: string;
  marca: string;
  placa: string;
  vaga: number;
}

export interface VeiculoResponse {
  id: number;
  modelo: string;
  marca: string;
  placa: string;
  vaga: number;
  dataCadastro: string;
  dataExpiracao: string;
  status: 'ATIVO' | 'EXPIRADO';
  proprietarioNome: string;
  proprietarioUnidade: string;
  bloco: 'A' | 'B';
}

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {

  private apiUrl = 'http://localhost:8080/veiculos';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<VeiculoResponse[]> {
    return this.http.get<VeiculoResponse[]>(this.apiUrl);
  }

  listarPorProprietario(proprietarioId: number): Observable<VeiculoResponse[]> {
    return this.http.get<VeiculoResponse[]>(`${this.apiUrl}/proprietario/${proprietarioId}`);
  }

  listarPorStatus(status: string): Observable<VeiculoResponse[]> {
    return this.http.get<VeiculoResponse[]>(`${this.apiUrl}/status/${status}`);
  }

  buscarPorPlaca(placa: string): Observable<VeiculoResponse> {
    return this.http.get<VeiculoResponse>(`${this.apiUrl}/placa/${placa}`);
  }

  cadastrar(proprietarioId: number, request: VeiculoRequest): Observable<VeiculoResponse> {
    return this.http.post<VeiculoResponse>(`${this.apiUrl}/proprietario/${proprietarioId}`, request);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}