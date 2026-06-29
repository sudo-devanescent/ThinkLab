import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService } from '../../../core/services/profile.service';
import { CognitiveRadarComponent } from '../../../shared/components/cognitive-radar/cognitive-radar.component';
import { ProgressBarLabeledComponent } from '../../../shared/components/progress-bar-labeled/progress-bar-labeled.component';
import { FeedbackLabelPipe } from '../../../shared/pipes/feedback-label.pipe';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    CognitiveRadarComponent,
    ProgressBarLabeledComponent,
    FeedbackLabelPipe
  ],
  template: `
    <div class="detail-container container animate-fade-in">
      <div *ngIf="isLoading" class="loading-spinner">
        <span class="spinner"></span>
        <span class="loading-text">Cargando información del estudiante...</span>
      </div>
      <div *ngIf="student">
      <header class="detail-header">
        <a routerLink="/teacher/dashboard" class="back-link">← Volver al panel</a>
        <div class="student-profile-title">
          <div class="avatar-large">{{ student.name | slice:0:1 }}</div>
          <div class="title-text">
            <h1>{{ student.name }}</h1>
            <p class="email">{{ student.email }}</p>
          </div>
        </div>
      </header>

      <div class="profile-grid">
        <!-- Left: Radar & Overview -->
        <div class="chart-section">
          <mat-card class="radar-card mat-mdc-card">
            <mat-card-content class="radar-content">
              <app-cognitive-radar [profile]="student" size="lg"></app-cognitive-radar>
            </mat-card-content>
          </mat-card>

          <!-- Overview Card -->
          <mat-card class="overview-card mat-mdc-card">
            <mat-card-header>
              <mat-card-title>Resumen Académico</mat-card-title>
            </mat-card-header>
            <mat-card-content class="overview-content">
              <div class="overview-grid">
                <div class="overview-item">
                  <span class="val">{{ student.totalDecisions }}</span>
                  <span class="lbl">Decisiones totales</span>
                </div>
                <div class="overview-item">
                  <span class="val">{{ student.recentDecisions }}</span>
                  <span class="lbl">Escenarios completados</span>
                </div>
                <div class="overview-item">
                  <span class="val" [ngClass]="student.isActive ? 'active' : 'inactive'">
                    {{ student.isActive ? 'ACTIVO' : 'INACTIVO' }}
                  </span>
                  <span class="lbl">Estado alumno</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Right: Detail Dimension Cards -->
        <div class="dimensions-section">
          <!-- Coherence Card -->
          <mat-card class="dimension-card mat-mdc-card">
            <mat-card-content>
              <div class="card-header-row">
                <h3>Coherencia</h3>
                <span class="val">{{ student.coherence | percent:'1.0-0' }}</span>
              </div>
              <app-progress-bar-labeled
                label="Lógica y alineación de decisiones"
                [value]="student.coherence"
                [showValue]="false">
              </app-progress-bar-labeled>
              <div class="qualitative-badge" [ngClass]="getLabelClass(student.coherence)">
                Nivel: {{ student.coherence | feedbackLabel:'coherence' }}
              </div>
              <p class="explanation">{{ getCoherenceDesc(student.coherence) }}</p>
            </mat-card-content>
          </mat-card>

          <!-- Risk Card -->
          <mat-card class="dimension-card mat-mdc-card">
            <mat-card-content>
              <div class="card-header-row">
                <h3>Tolerancia al Riesgo</h3>
                <span class="val">{{ student.risk | percent:'1.0-0' }}</span>
              </div>
              <app-progress-bar-labeled
                label="Búsqueda de beneficio vs seguridad"
                [value]="student.risk"
                [showValue]="false">
              </app-progress-bar-labeled>
              <div class="qualitative-badge" [ngClass]="getLabelClass(student.risk)">
                Nivel: {{ student.risk | feedbackLabel:'risk' }}
              </div>
              <p class="explanation">{{ getRiskDesc(student.risk) }}</p>
            </mat-card-content>
          </mat-card>

          <!-- Consistency Card -->
          <mat-card class="dimension-card mat-mdc-card">
            <mat-card-content>
              <div class="card-header-row">
                <h3>Consistencia</h3>
                <span class="val">{{ student.consistency | percent:'1.0-0' }}</span>
              </div>
              <app-progress-bar-labeled
                label="Estabilidad ética e intelectual"
                [value]="student.consistency"
                [showValue]="false">
              </app-progress-bar-labeled>
              <div class="qualitative-badge" [ngClass]="getLabelClass(student.consistency)">
                Nivel: {{ student.consistency | feedbackLabel:'consistency' }}
              </div>
              <p class="explanation">{{ getConsistencyDesc(student.consistency) }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
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

    .back-link {
      display: inline-block;
      font-size: 13px;
      font-weight: 500;
      color: #8b8fa8;
      margin-bottom: 16px;
      transition: color 0.2s ease;

      &:hover {
        color: #6c63ff;
      }
    }

    .student-profile-title {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .avatar-large {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: rgba(108, 99, 255, 0.15);
      border: 2px solid rgba(108, 99, 255, 0.3);
      color: #6c63ff;
      font-weight: 800;
      font-size: 24px;
    }

    .title-text {
      h1 {
        font-size: 28px;
        font-weight: 800;
        color: #e8e8f0;
        letter-spacing: -0.02em;
        margin-bottom: 2px;
      }
      .email {
        color: #8b8fa8;
        font-size: 14px;
      }
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
        align-items: center;
        justify-content: center;
      }
    }

    .overview-card {
      .mat-mdc-card-header {
        padding: 24px 24px 16px !important;
      }
      .overview-content {
        padding: 0 24px 24px !important;
      }
    }

    .overview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
    }

    .overview-item {
      background-color: rgba(15, 17, 23, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;

      .val {
        font-size: 22px;
        font-weight: 700;
        color: #00d4aa;
        font-family: monospace;

        &.active {
          color: #6bcb77;
        }
        &.inactive {
          color: #ff6b6b;
        }
      }

      .lbl {
        font-size: 11px;
        color: #8b8fa8;
        text-transform: uppercase;
        margin-top: 6px;
        letter-spacing: 0.05em;
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
export class StudentDetailComponent implements OnInit {
  student: any = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.profileService.getStudentDetail(id).subscribe({
          next: (detail) => {
            this.isLoading = false;
            this.student = detail;
          },
          error: (err) => {
            this.isLoading = false;
            this.snackBar.open(err.message, 'Cerrar', { duration: 4000 });
          }
        });
      } else {
        this.isLoading = false;
      }
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
