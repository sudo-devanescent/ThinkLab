import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { ProfileService } from '../../../core/services/profile.service';
import { ScenarioService } from '../../../core/services/scenario.service';
import { SessionStateService } from '../../../core/services/session-state.service';
import { CognitiveProfile } from '../../../core/models/cognitive-profile.model';
import { Scenario } from '../../../core/models/scenario.model';
import { ProgressBarLabeledComponent } from '../../../shared/components/progress-bar-labeled/progress-bar-labeled.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    ProgressBarLabeledComponent
  ],
  template: `
    <div class="dashboard-container container animate-fade-in">
      <header class="hero-section">
        <div class="hero-content">
          <h1>Hola, Estudiante 👋</h1>
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
          <mat-card-content class="profile-content" *ngIf="profile$ | async as profile">
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
              <div class="stat-item">
                <span class="stat-val">{{ sessionProgress }}/5</span>
                <span class="stat-lbl">Progreso Sesión</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Right: Next Challenge -->
        <mat-card class="challenge-card mat-mdc-card" *ngIf="nextScenarioPreview">
          <mat-card-header>
            <div class="badge-row">
              <span class="challenge-badge">PRÓXIMO DESAFÍO</span>
              <span class="difficulty-chip" [ngClass]="nextScenarioPreview.difficultyLevel">
                {{ nextScenarioPreview.difficultyLevel | uppercase }}
              </span>
            </div>
            <mat-card-title class="challenge-title">{{ nextScenarioPreview.title }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="challenge-context">
              {{ nextScenarioPreview.context | slice:0:180 }}...
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-flat-button color="primary" class="start-btn" (click)="onComenzar()">
              Comenzar Desafío
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

      &:hover {
        background-color: color.adjust(#6c63ff, $lightness: 5%) !important;
        box-shadow: 0 6px 16px rgba(108, 99, 255, 0.4) !important;
        transform: translateY(-1px);
      }
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
  nextScenarioPreview: Scenario | null = null;
  sessionProgress = 0;

  constructor(
    private profileService: ProfileService,
    private scenarioService: ScenarioService,
    private sessionState: SessionStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profile$ = this.profileService.getMyProfile();
    
    // Preview the next scenario
    const state = this.sessionState.getState();
    const previewIndex = state.currentIndex + 1;
    
    // We fetch scenario dynamically by id
    const scenarioNum = ((previewIndex - 1) % 10) + 1;
    this.scenarioService.getScenarioById(`scen-00${scenarioNum}`).subscribe(s => {
      this.nextScenarioPreview = s;
    });

    this.sessionProgress = state.currentIndex;
  }

  onComenzar() {
    this.scenarioService.getNextScenario().subscribe(() => {
      this.router.navigate(['/student/scenario']);
    });
  }
}
