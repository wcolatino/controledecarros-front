import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioRequest {
  login: string;
  senha: string;
  role: 'ADMIN' | 'PORTARIA';
}

export interface UsuarioResponse {
  id: number;
  login: string;
  role: 'ADMIN' | 'PORTARIA';
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(`${this.apiUrl}/usuarios`);
  }

  cadastrar(request: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/register`, request);
  }
}