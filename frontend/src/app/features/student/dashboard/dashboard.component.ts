import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ProfileService } from '../../../core/services/profile.service';
import { ScenarioService } from '../../../core/services/scenario.service';
import { CognitiveProfile } from '../../../core/models/cognitive-profile.model';
import { ProgressBarLabeledComponent } from '../../../shared/components/progress-bar-labeled/progress-bar-labeled.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    ProgressBarLabeledComponent
  ],
  template: `
    <div class="dashboard-container container animate-fade-in">
      <header class="hero-section">
        <div class="hero-content">
          <h1>Hola, Estudiante</h1>
          <p>Tu mente es tu mejor recurso. Enfréntate a los desafíos y entrena tu pensamiento crítico.</p>
        </div>
      </header>

      <div class="dashboard-grid">
        <!-- Left: Cognitive Profile Summary -->
        <mat-card class="profile-card mat-mdc-card">
          <mat-card-header>
            <mat-card-title>Perfil Cognitivo Resumido</mat-card-title>
            <mat-card-subtitle>Métricas actuales de tu toma de decisiones</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="profile-content">
            <div *ngIf="isLoading" class="loading-spinner">
              <span class="spinner"></span>
              <span class="loading-text">Cargando perfil...</span>
            </div>
            <ng-container *ngIf="profile$ | async as profile">
              <app-progress-bar-labeled
                label="Coherencia"
                [value]="profile.coherence">
              </app-progress-bar-labeled>

              <app-progress-bar-labeled
                label="Riesgo"
                [value]="profile.risk">
              </app-progress-bar-labeled>

              <app-progress-bar-labeled
                label="Consistencia"
                [value]="profile.consistency">
              </app-progress-bar-labeled>

              <div class="quick-stats">
                <div class="stat-item">
                  <span class="stat-val">{{ profile.totalDecisions }}</span>
                  <span class="stat-lbl">Decisiones Totales</span>
                </div>
              </div>
            </ng-container>
          </mat-card-content>
        </mat-card>

        <!-- Right: Next Challenge -->
        <mat-card class="challenge-card mat-mdc-card">
          <mat-card-header>
            <div class="badge-row">
              <span class="challenge-badge">PRÓXIMO DESAFÍO</span>
            </div>
            <mat-card-title class="challenge-title">Enfréntate a un nuevo escenario</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="challenge-context">
              Cada escenario pondrá a prueba tu capacidad de análisis, ética y toma de decisiones bajo presión.
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-flat-button color="primary" class="start-btn" [disabled]="isLoading" (click)="onComenzar()">
              <span *ngIf="!isLoading">Comenzar Desafío</span>
              <span *ngIf="isLoading" class="spinner"></span>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    @use "sass:color";

    .dashboard-container {
      padding: 32px 16px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .hero-section {
      background: linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(26, 29, 46, 0.5) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 32px;
      position: relative;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        right: -50px;
        top: -50px;
        width: 200px;
        height: 200px;
        background-color: #6c63ff;
        filter: blur(100px);
        opacity: 0.15;
        pointer-events: none;
      }

      h1 {
        font-size: 28px;
        font-weight: 800;
        color: #e8e8f0;
        margin-bottom: 8px;
      }

      p {
        color: #8b8fa8;
        font-size: 15px;
        max-width: 600px;
        line-height: 1.6;
      }
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .profile-card, .challenge-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .mat-mdc-card-header {
      padding: 24px 24px 16px !important;
    }

    .mat-mdc-card-content {
      padding: 0 24px 24px !important;
      flex: 1;
    }

    .mat-mdc-card-actions {
      padding: 0 24px 24px !important;
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 32px 0;

      .loading-text {
        font-size: 13px;
        color: #8b8fa8;
      }
    }

    .quick-stats {
      display: flex;
      gap: 16px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .stat-item {
      flex: 1;
      background-color: rgba(15, 17, 23, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.04);
      padding: 12px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .stat-val {
        font-size: 20px;
        font-weight: 700;
        color: #00d4aa;
      }

      .stat-lbl {
        font-size: 11px;
        color: #8b8fa8;
        text-transform: uppercase;
        margin-top: 4px;
        letter-spacing: 0.05em;
      }
    }

    .badge-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .challenge-badge {
      font-size: 10px;
      font-weight: 700;
      color: #6c63ff;
      letter-spacing: 0.1em;
    }

    .challenge-title {
      font-size: 22px;
      font-weight: 700;
      color: #e8e8f0;
      margin-top: 4px;
    }

    .challenge-context {
      color: #8b8fa8;
      font-size: 14px;
      line-height: 1.6;
    }

    .start-btn {
      width: 100%;
      height: 44px;
      background-color: #6c63ff !important;
      color: white !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3) !important;
      transition: all 0.3s ease !important;

      &:hover:not(:disabled) {
        background-color: color.adjust(#6c63ff, $lightness: 5%) !important;
        box-shadow: 0 6px 16px rgba(108, 99, 255, 0.4) !important;
        transform: translateY(-1px);
      }

      &:disabled {
        background-color: rgba(255, 255, 255, 0.05) !important;
        color: rgba(255, 255, 255, 0.25) !important;
        box-shadow: none !important;
      }
    }

    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  profile$!: Observable<CognitiveProfile>;
  isLoading = true;

  constructor(
    private profileService: ProfileService,
    private scenarioService: ScenarioService,
    private router: Router,
    private snackBar: MatSnackBar
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
  }

  onComenzar() {
    this.isLoading = true;
    this.scenarioService.getNextScenario().subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/student/scenario']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.message, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
