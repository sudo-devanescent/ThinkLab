import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feedback-badge" [ngClass]="levelClass">
      <div class="icon-container">
        <span class="icon">{{ iconSymbol }}</span>
      </div>
      <div class="content">
        <span class="level-tag">{{ levelText }}</span>
        <p class="message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .feedback-badge {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.3s ease;
      background-color: #1a1d2e;

      &.level-positive {
        border-color: rgba(107, 203, 119, 0.2);
        background: linear-gradient(135deg, #1a1d2e 0%, rgba(107, 203, 119, 0.05) 100%);
        .icon-container {
          background-color: rgba(107, 203, 119, 0.1);
          color: #6bcb77;
        }
        .level-tag {
          color: #6bcb77;
        }
      }

      &.level-neutral {
        border-color: rgba(255, 217, 61, 0.2);
        background: linear-gradient(135deg, #1a1d2e 0%, rgba(255, 217, 61, 0.05) 100%);
        .icon-container {
          background-color: rgba(255, 217, 61, 0.1);
          color: #ffd93d;
        }
        .level-tag {
          color: #ffd93d;
        }
      }

      &.level-warning {
        border-color: rgba(255, 107, 107, 0.2);
        background: linear-gradient(135deg, #1a1d2e 0%, rgba(255, 107, 107, 0.05) 100%);
        .icon-container {
          background-color: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
        }
        .level-tag {
          color: #ff6b6b;
        }
      }
    }

    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 18px;
      flex-shrink: 0;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .level-tag {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .message {
      font-size: 14px;
      color: #e8e8f0;
      line-height: 1.5;
    }
  `]
})
export class FeedbackBadgeComponent {
  @Input() level: 'positive' | 'neutral' | 'warning' = 'neutral';
  @Input() message = '';

  get levelClass(): string {
    return `level-${this.level}`;
  }

  get levelText(): string {
    switch (this.level) {
      case 'positive': return 'Retroalimentación Positiva';
      case 'warning': return 'Atención Requerida';
      default: return 'Retroalimentación';
    }
  }

  get iconSymbol(): string {
    switch (this.level) {
      case 'positive': return '✓';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  }
}
