import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface AdminScenario {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="admin-container container animate-fade-in">
      <header class="admin-header">
        <span class="subtitle">CONSOLA DE ADMINISTRACIÓN</span>
        <h1>Panel de Control del Sistema</h1>
        <p class="description">Monitorea los recursos de la plataforma ThinkLab y revisa los escenarios disponibles.</p>
      </header>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        <mat-card class="kpi-card mat-mdc-card">
          <mat-card-content class="kpi-content">
            <div class="kpi-icon users">👥</div>
            <div class="kpi-data">
              <span class="val">7</span>
              <span class="lbl">Usuarios Activos</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card mat-mdc-card">
          <mat-card-content class="kpi-content">
            <div class="kpi-icon scenarios">📚</div>
            <div class="kpi-data">
              <span class="val">10</span>
              <span class="lbl">Escenarios Disponibles</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card mat-mdc-card">
          <mat-card-content class="kpi-content">
            <div class="kpi-icon sessions">⚡</div>
            <div class="kpi-data">
              <span class="val">1</span>
              <span class="lbl">Sesiones en Vivo</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Scenarios List Section -->
      <mat-card class="scenarios-list-card mat-mdc-card">
        <mat-card-header class="list-header">
          <mat-card-title>Catálogo de Escenarios Narrativos</mat-card-title>
          <mat-card-subtitle>Lista de situaciones y configuración de adaptación en memoria</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="list-content">
          <div class="scenario-item" *ngFor="let s of scenarios; let i = index">
            <div class="scenario-index font-mono">#{{ i + 1 | number:'2.0' }}</div>
            
            <div class="scenario-details">
              <span class="scenario-title">{{ s.title }}</span>
              <div class="chips-row">
                <span class="difficulty-chip" [ngClass]="s.difficulty">{{ s.difficulty | uppercase }}</span>
                <span class="tag-chip" *ngFor="let t of s.tags">{{ t }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 40px 16px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .subtitle {
      font-size: 10px;
      font-weight: 700;
      color: #ffd93d;
      letter-spacing: 0.1em;
    }

    .admin-header h1 {
      font-size: 32px;
      font-weight: 800;
      color: #e8e8f0;
      letter-spacing: -0.02em;
      margin-top: 4px;
    }

    .admin-header .description {
      color: #8b8fa8;
      font-size: 15px;
      margin-top: 4px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .kpi-card {
      .kpi-content {
        padding: 24px !important;
        display: flex;
        align-items: center;
        gap: 20px;
      }
    }

    .kpi-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      font-size: 24px;
      
      &.users {
        background-color: rgba(108, 99, 255, 0.1);
        color: #6c63ff;
      }
      &.scenarios {
        background-color: rgba(0, 212, 170, 0.1);
        color: #00d4aa;
      }
      &.sessions {
        background-color: rgba(255, 217, 61, 0.1);
        color: #ffd93d;
      }
    }

    .kpi-data {
      display: flex;
      flex-direction: column;

      .val {
        font-size: 28px;
        font-weight: 800;
        color: #e8e8f0;
        font-family: monospace;
        line-height: 1;
      }

      .lbl {
        font-size: 12px;
        color: #8b8fa8;
        margin-top: 4px;
        font-weight: 500;
      }
    }

    .scenarios-list-card {
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      
      .list-header {
        padding: 24px 24px 16px !important;
      }

      .list-content {
        padding: 0 24px 24px !important;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    }

    .scenario-item {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 16px;
      background-color: rgba(15, 17, 23, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      transition: all 0.2s ease;

      &:hover {
        border-color: rgba(255, 255, 255, 0.08);
        background-color: rgba(15, 17, 23, 0.5);
      }
    }

    .scenario-index {
      font-size: 16px;
      font-weight: 700;
      color: #8b8fa8;
    }

    .scenario-details {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .scenario-title {
        font-size: 16px;
        font-weight: 600;
        color: #e8e8f0;
      }
    }

    .chips-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .difficulty-chip {
      font-size: 9px;
      font-weight: 800;
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

    .tag-chip {
      font-size: 10px;
      font-weight: 500;
      color: #8b8fa8;
      background-color: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.04);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .font-mono {
      font-family: monospace;
    }

    @media (max-width: 768px) {
      .kpi-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class AdminDashboardComponent {
  scenarios: AdminScenario[] = [
    { title: 'La inversión', difficulty: 'medium', tags: ['finanzas', 'toma-de-decisiones'] },
    { title: 'El informe confidencial', difficulty: 'hard', tags: ['ética', 'integridad-académica'] },
    { title: 'El equipo en crisis', difficulty: 'medium', tags: ['trabajo-en-equipo', 'conflictos'] },
    { title: 'La votación del grupo', difficulty: 'easy', tags: ['consenso', 'viaje-estudios'] },
    { title: 'El presupuesto del aula', difficulty: 'easy', tags: ['priorización', 'recursos'] },
    { title: 'El dilema del examen', difficulty: 'medium', tags: ['ética', 'honestidad'] },
    { title: 'El uso de la IA', difficulty: 'hard', tags: ['tecnología', 'educación'] },
    { title: 'La red social escolar', difficulty: 'medium', tags: ['convivencia', 'seguridad'] },
    { title: 'El proyecto de reciclaje', difficulty: 'easy', tags: ['ecología', 'comunidad'] },
    { title: 'El campeonato deportivo', difficulty: 'easy', tags: ['deporte', 'fair-play'] }
  ];
}
