import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DecisionResponse } from '../../../core/models/decision.model';
import { ScenarioOption } from '../../../core/models/scenario.model';
import { CognitiveProfile } from '../../../core/models/cognitive-profile.model';
import { ScenarioService } from '../../../core/services/scenario.service';
import { SessionStateService } from '../../../core/services/session-state.service';
import { FeedbackBadgeComponent } from '../../../shared/components/feedback-badge/feedback-badge.component';

@Component({
  selector: 'app-consequence',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    FeedbackBadgeComponent
  ],
  template: `
    <div class="consequence-container container animate-fade-in" *ngIf="decisionResponse && chosenOption">
      <header class="section-header">
        <span class="step-lbl">RESULTADO DE TU ELECCIÓN</span>
        <h1>Consecuencias Narrativas</h1>
      </header>

      <div class="consequence-grid">
        <!-- Left: Narrative Outcomes -->
        <div class="narrative-section">
          <!-- Chosen Option Summary -->
          <div class="chosen-option-summary">
            <span class="option-code">{{ chosenOption.code }}</span>
            <div class="option-text-wrapper">
              <span class="option-title">Elegiste:</span>
              <p class="option-desc">{{ chosenOption.text }}</p>
            </div>
          </div>

          <!-- Narrative Consequence -->
          <mat-card class="consequence-card mat-mdc-card">
            <mat-card-content>
              <h2 class="card-section-title">¿Qué sucedió después?</h2>
              <p class="consequence-narrative">
                {{ chosenOption.narrativeConsequence }}
              </p>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Right: Cognitive Feedback and Stats -->
        <div class="feedback-section">
          <app-feedback-badge 
            [level]="decisionResponse.feedback.level" 
            [message]="decisionResponse.feedback.message">
          </app-feedback-badge>

          <!-- Profile Changes -->
          <mat-card class="changes-card mat-mdc-card">
            <mat-card-header>
              <mat-card-title>Impacto en tu Perfil Cognitivo</mat-card-title>
              <mat-card-subtitle>Comparación con tu estado anterior</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="changes-content">
              <div class="dimension-change-row" *ngFor="let key of dimensionKeys">
                <span class="dim-name">{{ getDimensionLabel(key) }}</span>
                <div class="trend-wrapper">
                  <span class="val-badge old">{{ getOldValueText(key) }}</span>
                  <span class="trend-arrow" [ngClass]="getTrendClass(key)">{{ getTrendIcon(key) }}</span>
                  <span class="val-badge new" [ngClass]="getTrendClass(key)">{{ getNewValueText(key) }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Navigation Action -->
          <div class="action-wrapper">
            <button 
              *ngIf="decisionResponse.nextScenarioId" 
              mat-flat-button 
              color="primary" 
              class="next-btn"
              (click)="loadNextScenario()">
              Siguiente escenario
            </button>
            <button 
              *ngIf="!decisionResponse.nextScenarioId" 
              mat-flat-button 
              color="accent" 
              class="next-btn accent"
              routerLink="/student/profile">
              Ver mi perfil completo
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use "sass:color";

    .consequence-container {
      padding: 40px 16px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .step-lbl {
      font-size: 10px;
      font-weight: 700;
      color: #00d4aa;
      letter-spacing: 0.1em;
    }

    .section-header h1 {
      font-size: 32px;
      font-weight: 800;
      color: #e8e8f0;
      letter-spacing: -0.02em;
      margin-top: 4px;
    }

    .consequence-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 40px;
      align-items: start;
    }

    .narrative-section, .feedback-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .chosen-option-summary {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      padding: 24px;
      background-color: rgba(108, 99, 255, 0.05);
      border: 1px dashed rgba(108, 99, 255, 0.25);
      border-radius: 12px;
    }

    .option-code {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #6c63ff;
      color: white;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
      box-shadow: 0 0 12px rgba(108, 99, 255, 0.3);
    }

    .option-text-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .option-title {
        font-size: 11px;
        font-weight: 700;
        color: #8b8fa8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .option-desc {
        font-size: 15px;
        color: #e8e8f0;
        line-height: 1.5;
      }
    }

    .consequence-card {
      .mat-mdc-card-content {
        padding: 32px !important;
      }
    }

    .card-section-title {
      font-size: 20px;
      font-weight: 700;
      color: #e8e8f0;
      margin-bottom: 16px;
    }

    .consequence-narrative {
      font-size: 16px;
      color: #e8e8f0;
      line-height: 1.7;
    }

    .changes-card {
      .mat-mdc-card-header {
        padding: 24px 24px 16px !important;
      }
      .changes-content {
        padding: 0 24px 24px !important;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    }

    .dimension-change-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .dim-name {
        font-size: 14px;
        font-weight: 500;
        color: #8b8fa8;
      }
    }

    .trend-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .val-badge {
      font-size: 13px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.05);
      color: #8b8fa8;
      font-family: monospace;

      &.new {
        &.trend-up {
          background-color: rgba(107, 203, 119, 0.1);
          color: #6bcb77;
        }
        &.trend-down {
          background-color: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
        }
        &.trend-equal {
          background-color: rgba(255, 255, 255, 0.08);
          color: #e8e8f0;
        }
      }
    }

    .trend-arrow {
      font-size: 16px;
      font-weight: 700;
      
      &.trend-up {
        color: #6bcb77;
      }
      &.trend-down {
        color: #ff6b6b;
      }
      &.trend-equal {
        color: #8b8fa8;
      }
    }

    .action-wrapper {
      margin-top: 12px;
    }

    .next-btn {
      width: 100%;
      height: 48px;
      background-color: #6c63ff !important;
      color: white !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3) !important;
      transition: all 0.3s ease !important;

      &:hover {
        background-color: color.adjust(#6c63ff, $lightness: 5%) !important;
        box-shadow: 0 6px 16px rgba(108, 99, 255, 0.4) !important;
      }

      &.accent {
        background-color: #00d4aa !important;
        box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3) !important;

        &:hover {
          background-color: color.adjust(#00d4aa, $lightness: 5%) !important;
          box-shadow: 0 6px 16px rgba(0, 212, 170, 0.4) !important;
        }
      }
    }

    @media (max-width: 768px) {
      .consequence-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }
  `]
})
export class ConsequenceComponent implements OnInit {
  decisionResponse: DecisionResponse | null = null;
  chosenOption: ScenarioOption | null = null;
  previousProfile: CognitiveProfile | null = null;
  updatedProfile: CognitiveProfile | null = null;

  dimensionKeys: ('coherence' | 'risk' | 'consistency')[] = ['coherence', 'risk', 'consistency'];

  constructor(
    private router: Router,
    private scenarioService: ScenarioService,
    private sessionState: SessionStateService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.decisionResponse = navigation.extras.state['decisionResponse'];
      this.chosenOption = navigation.extras.state['chosenOption'];
      this.previousProfile = navigation.extras.state['previousProfile'];
    }
  }

  ngOnInit() {
    if (!this.decisionResponse || !this.chosenOption) {
      this.router.navigate(['/student/dashboard']);
      return;
    }
    this.updatedProfile = this.decisionResponse.updatedProfile;
  }

  getDimensionLabel(key: 'coherence' | 'risk' | 'consistency'): string {
    switch (key) {
      case 'coherence': return 'Coherencia';
      case 'risk': return 'Riesgo';
      case 'consistency': return 'Consistencia';
    }
  }

  getTrendIcon(key: 'coherence' | 'risk' | 'consistency'): string {
    if (!this.previousProfile || !this.updatedProfile) return '→';
    const prev = this.previousProfile[key];
    const curr = this.updatedProfile[key];
    if (curr > prev + 0.001) return '↑';
    if (curr < prev - 0.001) return '↓';
    return '→';
  }

  getTrendClass(key: 'coherence' | 'risk' | 'consistency'): string {
    if (!this.previousProfile || !this.updatedProfile) return 'trend-equal';
    const prev = this.previousProfile[key];
    const curr = this.updatedProfile[key];
    if (curr > prev + 0.001) return 'trend-up';
    if (curr < prev - 0.001) return 'trend-down';
    return 'trend-equal';
  }

  getOldValueText(key: 'coherence' | 'risk' | 'consistency'): string {
    if (!this.previousProfile) return '50%';
    return `${Math.round(this.previousProfile[key] * 100)}%`;
  }

  getNewValueText(key: 'coherence' | 'risk' | 'consistency'): string {
    if (!this.updatedProfile) return '50%';
    return `${Math.round(this.updatedProfile[key] * 100)}%`;
  }

  loadNextScenario() {
    this.scenarioService.getNextScenario().subscribe({
      next: () => {
        this.router.navigate(['/student/scenario']);
      }
    });
  }
}
