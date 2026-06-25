import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Scenario, ScenarioOption } from '../../../core/models/scenario.model';
import { SessionStateService } from '../../../core/services/session-state.service';
import { DecisionService } from '../../../core/services/decision.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-scenario-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  template: `
    <div class="viewer-container container animate-fade-in" *ngIf="scenario">
      <!-- Left Column: Context & Progress -->
      <div class="context-column">
        <div class="progress-section">
          <div class="progress-labels">
            <span class="session-indicator">Escenario {{ currentIndex }} de {{ totalRecommended }}</span>
            <span class="progress-percent">{{ progressPercent }}%</span>
          </div>
          <mat-progress-bar mode="determinate" [value]="progressPercent" class="session-progress-bar"></mat-progress-bar>
        </div>

        <div class="scenario-content">
          <div class="badge-row">
            <span class="difficulty-chip" [ngClass]="scenario.difficultyLevel">
              {{ scenario.difficultyLevel | uppercase }}
            </span>
          </div>
          <h1 class="scenario-title">{{ scenario.title }}</h1>
          <p class="scenario-context">{{ scenario.context }}</p>
        </div>
      </div>

      <!-- Right Column: Interactive Options -->
      <div class="options-column">
        <h2 class="options-header">¿Qué decisión tomarías en esta situación?</h2>
        
        <div class="options-grid">
          <div 
            *ngFor="let option of scenario.options" 
            class="option-card"
            [class.selected]="selectedOption === option"
            (click)="selectOption(option)">
            <div class="letter-circle">
              {{ option.code }}
            </div>
            <div class="option-text">
              {{ option.text }}
            </div>
          </div>
        </div>

        <button 
          mat-flat-button 
          color="primary" 
          class="confirm-btn"
          [disabled]="!selectedOption || isSubmitting"
          (click)="onConfirmDecision()">
          <span *ngIf="!isSubmitting">Confirmar decisión</span>
          <span *ngIf="isSubmitting" class="spinner"></span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @use "sass:color";

    .viewer-container {
      padding: 40px 16px;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 48px;
      align-items: start;
    }

    .context-column {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .progress-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 500;
      color: #8b8fa8;
    }

    .session-progress-bar {
      height: 6px !important;
      border-radius: 3px;
      background-color: rgba(255, 255, 255, 0.05) !important;
      
      ::ng-deep .mdc-linear-progress__bar-inner {
        background-color: #6c63ff !important;
      }
    }

    .scenario-content {
      background-color: #1a1d2e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    }

    .badge-row {
      margin-bottom: 16px;
    }

    .difficulty-chip {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 0.05em;

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

    .scenario-title {
      font-size: 28px;
      font-weight: 800;
      color: #e8e8f0;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    .scenario-context {
      font-size: 15px;
      color: #e8e8f0;
      line-height: 1.7;
      max-width: 65ch;
    }

    .options-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .options-header {
      font-size: 18px;
      font-weight: 600;
      color: #8b8fa8;
    }

    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .option-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background-color: #1a1d2e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        border-color: rgba(108, 99, 255, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      }

      &.selected {
        background-color: rgba(108, 99, 255, 0.12);
        border-color: #6c63ff;
        box-shadow: 0 0 16px rgba(108, 99, 255, 0.1);
        
        .letter-circle {
          background-color: #6c63ff;
          color: white;
          box-shadow: 0 0 8px rgba(108, 99, 255, 0.4);
        }
      }
    }

    .letter-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #8b8fa8;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .option-text {
      font-size: 14px;
      color: #e8e8f0;
      line-height: 1.5;
    }

    .confirm-btn {
      height: 48px;
      background-color: #6c63ff !important;
      color: white !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      margin-top: 12px;
      box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3) !important;
      transition: all 0.3s ease !important;

      &:hover:not(:disabled) {
        background-color: color.adjust(#6c63ff, $lightness: 5%) !important;
        box-shadow: 0 6px 16px rgba(108, 99, 255, 0.4) !important;
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

    @media (max-width: 1024px) {
      .viewer-container {
        grid-template-columns: 1fr;
        gap: 32px;
      }
    }
  `]
})
export class ScenarioViewerComponent implements OnInit {
  scenario: Scenario | null = null;
  sessionScenarioId = '';
  currentIndex = 1;
  totalRecommended = 5;
  selectedOption: ScenarioOption | null = null;
  isSubmitting = false;
  
  private startTime = 0;

  constructor(
    private sessionState: SessionStateService,
    private decisionService: DecisionService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    const state = this.sessionState.getState();
    if (!state.currentScenario || !state.sessionScenarioId) {
      this.router.navigate(['/student/dashboard']);
      return;
    }

    this.scenario = state.currentScenario;
    this.sessionScenarioId = state.sessionScenarioId;
    this.currentIndex = state.currentIndex;
    this.totalRecommended = state.totalRecommended;
    
    // Start stopwatch invisibly
    this.startTime = performance.now();
  }

  get progressPercent(): number {
    // Current index is 1-based. To show completion progress, we can map:
    // scenario 1 of 5 -> 20%
    return Math.round((this.currentIndex / this.totalRecommended) * 100);
  }

  selectOption(option: ScenarioOption) {
    this.selectedOption = option;
  }

  onConfirmDecision() {
    if (!this.selectedOption || this.isSubmitting) return;

    this.isSubmitting = true;
    const responseTimeMs = Math.round(performance.now() - this.startTime);
    const previousProfile = { ...this.profileService.getCachedProfile() };

    const payload = {
      sessionScenarioId: this.sessionScenarioId,
      optionId: this.selectedOption.id,
      responseTimeMs
    };

    this.decisionService.submitDecision(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        // Navigate to consequence page, passing response and selected option
        this.router.navigate(['/student/consequence'], {
          state: {
            decisionResponse: response,
            chosenOption: this.selectedOption,
            previousProfile: previousProfile
          }
        });
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
