import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ProfileService } from '../../../core/services/profile.service';
import { CognitiveProfile } from '../../../core/models/cognitive-profile.model';
import { CognitiveRadarComponent } from '../../../shared/components/cognitive-radar/cognitive-radar.component';
import { ProgressBarLabeledComponent } from '../../../shared/components/progress-bar-labeled/progress-bar-labeled.component';
import { FeedbackLabelPipe } from '../../../shared/pipes/feedback-label.pipe';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
    CognitiveRadarComponent,
    ProgressBarLabeledComponent,
    FeedbackLabelPipe
  ],
  template: `
    <div class="profile-container container animate-fade-in">
      <div *ngIf="isLoading" class="loading-spinner">
        <span class="spinner"></span>
        <span class="loading-text">Cargando perfil...</span>
      </div>
      <div *ngIf="profile$ | async as profile">
      <header class="profile-header">
        <span class="subtitle">ESTADÍSTICAS AVANZADAS</span>
        <h1>Mi Perfil Cognitivo</h1>
        <p class="description">Análisis en tiempo real de tus procesos lógicos, de riesgo y consistencia moral.</p>
      </header>

      <div class="profile-grid">
        <!-- Left: Chart & Stats -->
        <div class="chart-section">
          <mat-card class="radar-card mat-mdc-card">
            <mat-card-content class="radar-content">
              <app-cognitive-radar [profile]="profile" size="lg"></app-cognitive-radar>
              
              <div class="radar-stats-box">
                <span class="stat-num">{{ profile.totalDecisions }}</span>
                <span class="stat-lbl">Decisiones Totales</span>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Historical List -->
          <mat-card class="history-card mat-mdc-card">
            <mat-card-header>
              <mat-card-title>Historial de Decisiones</mat-card-title>
              <mat-card-subtitle>Últimos 5 escenarios completados</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="history-content">
              <div class="history-item" *ngFor="let item of history">
                <div class="item-main">
                  <span class="item-title">{{ item.scenarioTitle }}</span>
                  <span class="item-option">Opción elegida: <strong>{{ item.optionCode }}</strong></span>
                </div>
                <div class="item-side">
                  <span class="difficulty-chip" [ngClass]="item.difficulty">
                    {{ item.difficulty | uppercase }}
                  </span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Right: Dimension Cards -->
        <div class="dimensions-section">
          <!-- Coherence Card -->
          <mat-card class="dimension-card mat-mdc-card">
            <mat-card-content>
              <div class="card-header-row">
                <h3>Coherencia</h3>
                <span class="val">{{ profile.coherence | percent:'1.0-0' }}</span>
              </div>
              <app-progress-bar-labeled
                label="Lógica y razonamiento"
                [value]="profile.coherence"
                [showValue]="false">
              </app-progress-bar-labeled>
              <div class="qualitative-badge" [ngClass]="getLabelClass(profile.coherence)">
                Nivel: {{ profile.coherence | feedbackLabel:'coherence' }}
              </div>
              <p class="explanation">{{ getCoherenceDesc(profile.coherence) }}</p>
            </mat-card-content>
          </mat-card>

          <!-- Risk Card -->
          <mat-card class="dimension-card mat-mdc-card">
            <mat-card-content>
              <div class="card-header-row">
                <h3>Tolerancia al Riesgo</h3>
                <span class="val">{{ profile.risk | percent:'1.0-0' }}</span>
              </div>
              <app-progress-bar-labeled
                label="Búsqueda de beneficio vs seguridad"
                [value]="profile.risk"
                [showValue]="false">
              </app-progress-bar-labeled>
              <div class="qualitative-badge" [ngClass]="getLabelClass(profile.risk)">
                Nivel: {{ profile.risk | feedbackLabel:'risk' }}
              </div>
              <p class="explanation">{{ getRiskDesc(profile.risk) }}</p>
            </mat-card-content>
          </mat-card>

          <!-- Consistency Card -->
          <mat-card class="dimension-card mat-mdc-card">
            <mat-card-content>
              <div class="card-header-row">
                <h3>Consistencia</h3>
                <span class="val">{{ profile.consistency | percent:'1.0-0' }}</span>
              </div>
              <app-progress-bar-labeled
                label="Solidez ética e intelectual"
                [value]="profile.consistency"
                [showValue]="false">
              </app-progress-bar-labeled>
              <div class="qualitative-badge" [ngClass]="getLabelClass(profile.consistency)">
                Nivel: {{ profile.consistency | feedbackLabel:'consistency' }}
              </div>
              <p class="explanation">{{ getConsistencyDesc(profile.consistency) }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 40px 16px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 64px 0;

      .loading-text {
        font-size: 13px;
        color: #8b8fa8;
      }
    }

    .spinner {
      display: inline-block;
      width: 24px;
      height: 24px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .subtitle {
      font-size: 10px;
      font-weight: 700;
      color: #6c63ff;
      letter-spacing: 0.1em;
    }

    .profile-header h1 {
      font-size: 32px;
      font-weight: 800;
      color: #e8e8f0;
      letter-spacing: -0.02em;
      margin-top: 4px;
    }

    .profile-header .description {
      color: #8b8fa8;
      font-size: 15px;
      margin-top: 4px;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      align-items: start;
    }

    .chart-section, .dimensions-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .radar-card {
      .radar-content {
        padding: 32px !important;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        position: relative;
      }
    }

    .radar-stats-box {
      text-align: center;
      background-color: rgba(15, 17, 23, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 12px 24px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .stat-num {
        font-size: 24px;
        font-weight: 700;
        color: #00d4aa;
      }

      .stat-lbl {
        font-size: 11px;
        color: #8b8fa8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .history-card {
      .mat-mdc-card-header {
        padding: 24px 24px 16px !important;
      }
      .history-content {
        padding: 0 24px 24px !important;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: rgba(15, 17, 23, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        border-color: rgba(255, 255, 255, 0.08);
        background-color: rgba(15, 17, 23, 0.5);
      }
    }

    .item-main {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .item-title {
      font-size: 14px;
      font-weight: 600;
      color: #e8e8f0;
    }

    .item-option {
      font-size: 12px;
      color: #8b8fa8;
      strong {
        color: #6c63ff;
      }
    }

    .difficulty-chip {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;

      &.easy {
        background-color: rgba(107, 203, 119, 0.1);
        color: #6bcb77;
      }
      &.medium {
        background-color: rgba(255, 217, 61, 0.1);
        color: #ffd93d;
      }
      &.hard {
        background-color: rgba(255, 107, 107, 0.1);
        color: #ff6b6b;
      }
    }

    .dimension-card {
      .mat-mdc-card-content {
        padding: 24px !important;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }

    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 18px;
        font-weight: 700;
        color: #e8e8f0;
      }

      .val {
        font-size: 20px;
        font-weight: 700;
        color: #6c63ff;
      }
    }

    .qualitative-badge {
      align-self: flex-start;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;

      &.level-high {
        background-color: rgba(107, 203, 119, 0.1);
        color: #6bcb77;
      }
      &.level-medium {
        background-color: rgba(255, 217, 61, 0.1);
        color: #ffd93d;
      }
      &.level-low {
        background-color: rgba(255, 107, 107, 0.1);
        color: #ff6b6b;
      }
    }

    .explanation {
      font-size: 13px;
      color: #8b8fa8;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .profile-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }
  `]
})
export class StudentProfileComponent implements OnInit {
  profile$!: Observable<CognitiveProfile>;
  isLoading = true;
  history: { scenarioTitle: string; optionCode: string; difficulty: string }[] = [];

  constructor(
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.profile$ = this.profileService.getMyProfile().pipe(
      finalize(() => this.isLoading = false),
      catchError(err => {
        this.isLoading = false;
        this.snackBar.open(err.message, 'Cerrar', { duration: 4000 });
        return of({ coherence: 0.5, risk: 0.5, consistency: 0.5, totalDecisions: 0 });
      })
    );
    this.profileService.getHistory().subscribe({
      next: (data) => { this.history = data; this.cdr.markForCheck(); },
      error: () => { this.history = []; this.cdr.markForCheck(); }
    });
  }

  getLabelClass(value: number): string {
    if (value >= 0.7) return 'level-high';
    if (value >= 0.4) return 'level-medium';
    return 'level-low';
  }

  getCoherenceDesc(value: number): string {
    if (value >= 0.7) {
      return 'Razonamiento lógico excelente. Tomas decisiones coherentes, sopesando adecuadamente los hechos objetivos.';
    } else if (value >= 0.4) {
      return 'Lógica moderada. Algunas decisiones muestran inconsistencias menores frente a los hechos presentados.';
    } else {
      return 'Razonamiento errático. Frecuentemente tomas decisiones impulsivas que contradicen la información factual.';
    }
  }

  getRiskDesc(value: number): string {
    if (value >= 0.7) {
      return 'Tolerancia de riesgo elevada. Priorizas los beneficios potenciales innovadores sobre la seguridad de los recursos.';
    } else if (value >= 0.4) {
      return 'Tolerancia de riesgo equilibrada. Evalúas de manera razonable los peligros e impactos potenciales de cada acción.';
    } else {
      return 'Aversión al riesgo alta. Evitas el peligro a toda costa, perdiendo oportunidades interesantes de crecimiento.';
    }
  }

  getConsistencyDesc(value: number): string {
    if (value >= 0.7) {
      return 'Alta solidez intelectual. Mantienes principios estables y consistencia ética a lo largo de las evaluaciones.';
    } else if (value >= 0.4) {
      return 'Solidez intelectual aceptable. Tiendes a cambiar tus principios lógicos o éticos bajo presiones del entorno.';
    } else {
      return 'Comportamiento inestable. Tus principios cambian drásticamente entre escenarios, revelando dudas analíticas.';
    }
  }
}
