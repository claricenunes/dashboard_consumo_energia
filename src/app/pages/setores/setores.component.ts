import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SetorService } from '../../services/setor.service';
import { Setor } from '../../models/setor.model';

const CATEGORIAS = ['Produção', 'Administrativo', 'Logística', 'Manutenção', 'Qualidade'];

@Component({
  selector: 'app-setores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setores.component.html'
})
export class SetoresComponent implements OnInit {
  setores = signal<Setor[]>([]);
  erro = signal(false);
  form: Partial<Setor> = {};
  editId = signal<string | number | null>(null);
  exibirFormulario = signal(false);
  readonly categorias = CATEGORIAS;

  constructor(private setorService: SetorService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.setorService.getAll().subscribe({
      next: data => this.setores.set(data),
      error: () => this.erro.set(true)
    });
  }

  abrirFormulario(setor?: Setor): void {
    this.editId.set(setor?.id ?? null);
    this.form = setor ? { ...setor } : {};
    this.exibirFormulario.set(true);
  }

  cancelar(): void {
    this.exibirFormulario.set(false);
    this.form = {};
    this.editId.set(null);
  }

  salvar(): void {
    const payload = {
      nome: this.form.nome!.trim(),
      categoria: this.form.categoria!,
      consumo_meta: Number(this.form.consumo_meta),
      consumo_atual: Number(this.form.consumo_atual)
    };
    const id = this.editId();
    if (id !== null) {
      this.setorService.update(id, { ...payload, id })
        .subscribe({ next: () => { this.carregar(); this.cancelar(); } });
    } else {
      this.setorService.create(payload)
        .subscribe({ next: () => { this.carregar(); this.cancelar(); } });
    }
  }

  excluir(id: string | number): void {
    if (confirm('Excluir este setor?')) {
      this.setorService.remove(id).subscribe({ next: () => this.carregar() });
    }
  }

  getStatus(setor: Setor): 'success' | 'warning' | 'danger' {
    const ratio = setor.consumo_atual / setor.consumo_meta;
    if (ratio > 1.1) return 'danger';
    if (ratio > 1.0) return 'warning';
    return 'success';
  }

  getStatusLabel(setor: Setor): string {
    const s = this.getStatus(setor);
    return s === 'success' ? 'OK' : s === 'warning' ? 'Alerta' : 'Crítico';
  }
}
