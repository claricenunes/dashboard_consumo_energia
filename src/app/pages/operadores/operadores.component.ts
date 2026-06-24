import { Component, OnInit, computed, signal } from '@angular/core';
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
  operadores = signal<Operador[]>([]);
  setores = signal<Setor[]>([]);
  erro = signal(false);
  form: Partial<Operador> = {};
  editId = signal<string | number | null>(null);
  exibirFormulario = signal(false);
  readonly turnos = TURNOS;

  setoresPorCategoria = computed(() => {
    const mapa = new Map<string, Setor[]>();
    this.setores().forEach(s => {
      const cat = s.categoria || 'Outros';
      if (!mapa.has(cat)) mapa.set(cat, []);
      mapa.get(cat)!.push(s);
    });
    return Array.from(mapa.entries()).map(([categoria, setores]) => ({ categoria, setores }));
  });

  constructor(
    private operadorService: OperadorService,
    private setorService: SetorService
  ) {}

  ngOnInit(): void {
    this.setorService.getAll().subscribe({
      next: data => this.setores.set(data),
      error: () => this.erro.set(true)
    });
    this.operadorService.getAll().subscribe({
      next: data => this.operadores.set(data),
      error: () => this.erro.set(true)
    });
  }

  carregarOperadores(): void {
    this.operadorService.getAll().subscribe({
      next: data => this.operadores.set(data)
    });
  }

  getNomeSetor(setorId: string | number): string {
    return this.setores().find(s => String(s.id) === String(setorId))?.nome ?? '—';
  }

  abrirFormulario(operador?: Operador): void {
    this.editId.set(operador?.id ?? null);
    this.form = operador ? { ...operador } : {};
    this.exibirFormulario.set(true);
  }

  cancelar(): void {
    this.exibirFormulario.set(false);
    this.form = {};
    this.editId.set(null);
  }

  salvar(): void {
    const payload: Omit<Operador, 'id'> = {
      setorId: this.form.setorId!,
      nome: this.form.nome!.trim(),
      turno: this.form.turno!,
      matricula: this.form.matricula!.trim().toUpperCase()
    };
    const id = this.editId();
    if (id !== null) {
      this.operadorService.update(id, { ...payload, id })
        .subscribe({ next: () => { this.carregarOperadores(); this.cancelar(); } });
    } else {
      this.operadorService.create(payload)
        .subscribe({ next: () => { this.carregarOperadores(); this.cancelar(); } });
    }
  }

  excluir(id: string | number): void {
    if (confirm('Excluir este operador?')) {
      this.operadorService.remove(id).subscribe({ next: () => this.carregarOperadores() });
    }
  }
}
