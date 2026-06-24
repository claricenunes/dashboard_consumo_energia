import { Component, OnInit } from '@angular/core';
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
  setores: Setor[] = [];
  form: Partial<Setor> = {};
  editId: number | null = null;
  exibirFormulario = false;
  readonly categorias = CATEGORIAS;

  constructor(private setorService: SetorService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.setorService.getAll().subscribe(data => (this.setores = data));
  }

  abrirFormulario(setor?: Setor): void {
    this.editId = setor?.id ?? null;
    this.form = setor ? { ...setor } : {};
    this.exibirFormulario = true;
  }

  cancelar(): void {
    this.exibirFormulario = false;
    this.form = {};
    this.editId = null;
  }

  salvar(): void {
    const payload = {
      nome: this.form.nome!.trim(),
      categoria: this.form.categoria!,
      consumo_meta: Number(this.form.consumo_meta),
      consumo_atual: Number(this.form.consumo_atual)
    };
    if (this.editId) {
      this.setorService.update(this.editId, { ...payload, id: this.editId })
        .subscribe(() => { this.carregar(); this.cancelar(); });
    } else {
      this.setorService.create(payload)
        .subscribe(() => { this.carregar(); this.cancelar(); });
    }
  }

  excluir(id: number): void {
    if (confirm('Excluir este setor?')) {
      this.setorService.remove(id).subscribe(() => this.carregar());
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
