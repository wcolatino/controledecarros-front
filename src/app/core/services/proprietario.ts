import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProprietarioRequest {
  nome: string;
  unidade: string;
  bloco: 'A' | 'B';
  telefone: string;
}

export interface ProprietarioResponse {
  id: number;
  nome: string;
  unidade: string;
  bloco: 'A' | 'B';
  telefone: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProprietarioService {

  private apiUrl = 'http://localhost:8080/proprietarios';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<ProprietarioResponse[]> {
    return this.http.get<ProprietarioResponse[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<ProprietarioResponse> {
    return this.http.get<ProprietarioResponse>(`${this.apiUrl}/${id}`);
  }

  cadastrar(request: ProprietarioRequest): Observable<ProprietarioResponse> {
    return this.http.post<ProprietarioResponse>(this.apiUrl, request);
  }

  atualizar(id: number, request: ProprietarioRequest): Observable<ProprietarioResponse> {
    return this.http.put<ProprietarioResponse>(`${this.apiUrl}/${id}`, request);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}