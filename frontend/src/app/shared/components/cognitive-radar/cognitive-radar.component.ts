import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CognitiveProfile } from '../../../core/models/cognitive-profile.model';

Chart.register(...registerables);

@Component({
  selector: 'app-cognitive-radar',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container" [ngClass]="sizeClass" [style.height.px]="containerHeight" [style.width.px]="containerWidth">
      <canvas baseChart
              [data]="radarChartData"
              [options]="radarChartOptions"
              [type]="'radar'">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      position: relative;
    }
  `]
})
export class CognitiveRadarComponent implements OnInit, OnChanges {
  @Input() profile!: CognitiveProfile;
  @Input() size: 'sm' | 'lg' = 'lg';

  public radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.2,
          display: false,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        pointLabels: {
          color: '#8b8fa8',
          font: {
            family: 'Inter',
            size: 11,
            weight: 600,
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw as number;
            return ` ${context.label}: ${Math.round(val * 100)}%`;
          }
        }
      }
    }
  };

  public radarChartLabels: string[] = ['Coherencia', 'Riesgo', 'Consistencia'];

  public radarChartData: ChartConfiguration<'radar'>['data'] = {
    labels: this.radarChartLabels,
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Perfil Cognitivo',
        backgroundColor: 'rgba(108, 99, 255, 0.15)',
        borderColor: '#6c63ff',
        pointBackgroundColor: '#00d4aa',
        pointBorderColor: '#1a1d2e',
        pointHoverBackgroundColor: '#1a1d2e',
        pointHoverBorderColor: '#00d4aa',
        borderWidth: 2,
        pointRadius: 4,
      }
    ]
  };

  ngOnInit() {
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profile'] && !changes['profile'].firstChange) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    if (this.profile) {
      this.radarChartData = {
        ...this.radarChartData,
        datasets: [
          {
            ...this.radarChartData.datasets[0],
            data: [
              this.profile.coherence,
              this.profile.risk,
              this.profile.consistency
            ]
          }
        ]
      };
    }
  }

  get sizeClass(): string {
    return `size-${this.size}`;
  }

  get containerHeight(): number {
    return this.size === 'sm' ? 200 : 320;
  }

  get containerWidth(): number {
    return this.size === 'sm' ? 220 : 340;
  }
}
