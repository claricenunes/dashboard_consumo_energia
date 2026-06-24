import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setor } from '../models/setor.model';

@Injectable({ providedIn: 'root' })
export class SetorService {
  private readonly apiUrl = 'http://localhost:3000/setores';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Setor[]> {
    return this.http.get<Setor[]>(this.apiUrl);
  }

  create(setor: Omit<Setor, 'id'>): Observable<Setor> {
    return this.http.post<Setor>(this.apiUrl, setor);
  }

  update(id: number, setor: Setor): Observable<Setor> {
    return this.http.put<Setor>(`${this.apiUrl}/${id}`, setor);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
