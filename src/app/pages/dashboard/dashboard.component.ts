import { Component, OnInit, OnDestroy, ViewChild, ElementRef, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { forkJoin, Subscription } from 'rxjs';
import { SetorService } from '../../services/setor.service';
import { OperadorService } from '../../services/operador.service';
import { Setor } from '../../models/setor.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('barChart', { static: true }) barChartRef!: ElementRef<HTMLCanvasElement>;

  setores = signal<Setor[]>([]);
  totalOperadores = signal(0);
  carregado = signal(false);
  erro = signal(false);

  totalConsumo = computed(() => this.setores().reduce((acc, s) => acc + s.consumo_atual, 0));
  totalMeta    = computed(() => this.setores().reduce((acc, s) => acc + s.consumo_meta, 0));
  setoresAcimaMeta = computed(() => this.setores().filter(s => s.consumo_atual > s.consumo_meta).length);

  private chart: Chart | null = null;
  private sub?: Subscription;

  constructor(
    private setorService: SetorService,
    private operadorService: OperadorService
  ) {}

  ngOnInit(): void {
    this.sub = forkJoin({
      setores: this.setorService.getAll(),
      operadores: this.operadorService.getAll()
    }).subscribe({
      next: ({ setores, operadores }) => {
        this.setores.set(setores);
        this.totalOperadores.set(operadores.length);
        this.carregado.set(true);
        this.renderizarGrafico(this.barChartRef.nativeElement);
      },
      error: () => this.erro.set(true)
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chart?.destroy();
    this.chart = null;
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

  getBarWidth(setor: Setor): number {
    return Math.min(Math.round((setor.consumo_atual / setor.consumo_meta) * 100), 100);
  }

  private renderizarGrafico(canvas: HTMLCanvasElement): void {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.setores().map(s => s.nome),
        datasets: [
          {
            label: 'Consumo Atual (kWh)',
            data: this.setores().map(s => s.consumo_atual),
            backgroundColor: this.setores().map(s => {
              const st = this.getStatus(s);
              if (st === 'danger')  return 'rgba(220,53,69,0.75)';
              if (st === 'warning') return 'rgba(255,193,7,0.75)';
              return 'rgba(25,135,84,0.75)';
            })
          },
          {
            label: 'Meta (kWh)',
            data: this.setores().map(s => s.consumo_meta),
            backgroundColor: 'rgba(13,110,253,0.25)',
            borderColor: 'rgba(13,110,253,0.8)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}
