import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operador } from '../models/operador.model';

@Injectable({ providedIn: 'root' })
export class OperadorService {
  private readonly apiUrl = 'http://localhost:3000/operadores';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Operador[]> {
    return this.http.get<Operador[]>(this.apiUrl);
  }

  create(operador: Omit<Operador, 'id'>): Observable<Operador> {
    return this.http.post<Operador>(this.apiUrl, operador);
  }

  update(id: number, operador: Operador): Observable<Operador> {
    return this.http.put<Operador>(`${this.apiUrl}/${id}`, operador);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
