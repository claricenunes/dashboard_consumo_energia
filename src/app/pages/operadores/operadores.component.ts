import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperadorService } from '../../services/operador.service';
import { SetorService } from '../../services/setor.service';
import { Operador } from '../../models/operador.model';
import { Setor } from '../../models/setor.model';

const TURNOS = ['Manhã', 'Tarde', 'Noite'];

@Component({
  selector: 'app-operadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operadores.component.html'
})
export class OperadoresComponent implements OnInit {
  operadores: Operador[] = [];
  setores: Setor[] = [];
  form: Partial<Operador> = {};
  editId: number | null = null;
  exibirFormulario = false;
  readonly turnos = TURNOS;

  constructor(
    private operadorService: OperadorService,
    private setorService: SetorService
  ) {}

  ngOnInit(): void {
    this.carregarSetores();
    this.carregarOperadores();
  }

  carregarOperadores(): void {
    this.operadorService.getAll().subscribe(data => (this.operadores = data));
  }

  carregarSetores(): void {
    this.setorService.getAll().subscribe(data => (this.setores = data));
  }

  get setoresPorCategoria(): { categoria: string; setores: Setor[] }[] {
    const mapa = new Map<string, Setor[]>();
    this.setores.forEach(s => {
      const cat = s.categoria || 'Outros';
      if (!mapa.has(cat)) mapa.set(cat, []);
      mapa.get(cat)!.push(s);
    });
    return Array.from(mapa.entries()).map(([categoria, setores]) => ({ categoria, setores }));
  }

  getNomeSetor(setorId: number): string {
    return this.setores.find(s => s.id === setorId)?.nome ?? '—';
  }

  abrirFormulario(operador?: Operador): void {
    this.editId = operador?.id ?? null;
    this.form = operador ? { ...operador } : {};
    this.exibirFormulario = true;
  }

  cancelar(): void {
    this.exibirFormulario = false;
    this.form = {};
    this.editId = null;
  }

  salvar(): void {
    const payload: Omit<Operador, 'id'> = {
      setorId: Number(this.form.setorId),
      nome: this.form.nome!.trim(),
      turno: this.form.turno!,
      matricula: this.form.matricula!.trim().toUpperCase()
    };
    if (this.editId) {
      this.operadorService.update(this.editId, { ...payload, id: this.editId })
        .subscribe(() => { this.carregarOperadores(); this.cancelar(); });
    } else {
      this.operadorService.create(payload)
        .subscribe(() => { this.carregarOperadores(); this.cancelar(); });
    }
  }

  excluir(id: number): void {
    if (confirm('Excluir este operador?')) {
      this.operadorService.remove(id).subscribe(() => this.carregarOperadores());
    }
  }
}
