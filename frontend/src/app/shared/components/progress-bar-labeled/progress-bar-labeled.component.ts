import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar-labeled',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-bar-container">
      <div class="progress-bar-header">
        <span class="label">{{ label }}</span>
        <span class="value" *ngIf="showValue">{{ valuePercent }}%</span>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill" [style.width.%]="valuePercent" [ngClass]="statusClass"></div>
      </div>
    </div>
  `,
  styles: [`
    .progress-bar-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }
    .progress-bar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      color: #8b8fa8;
    }
    .progress-bar-track {
      width: 100%;
      height: 8px;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.03);
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease;
      
      &.status-error {
        background-color: #ff6b6b;
        box-shadow: 0 0 8px rgba(255, 107, 107, 0.3);
      }
      &.status-warning {
        background-color: #ffd93d;
        box-shadow: 0 0 8px rgba(255, 217, 61, 0.3);
      }
      &.status-success {
        background-color: #6bcb77;
        box-shadow: 0 0 8px rgba(107, 203, 119, 0.3);
      }
    }
  `]
})
export class ProgressBarLabeledComponent {
  @Input() label = '';
  @Input() value = 0; // 0 to 1
  @Input() showValue = true;

  get valuePercent(): number {
    return Math.min(Math.max(Math.round(this.value * 100), 0), 100);
  }

  get statusClass(): string {
    const val = this.value;
    if (val < 0.4) {
      return 'status-error';
    } else if (val <= 0.7) {
      return 'status-warning';
    } else {
      return 'status-success';
    }
  }
}
