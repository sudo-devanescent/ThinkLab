import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProfileService } from '../../../core/services/profile.service';
import { StudentSummary } from '../../../core/models/user.model';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="teacher-container container animate-fade-in">
      <header class="dashboard-header">
        <span class="subtitle">VISTA GENERAL</span>
        <h1>Seguimiento de Estudiantes</h1>
        <p class="description">Analiza y evalúa el progreso del pensamiento crítico en tu aula.</p>
      </header>

      <!-- Search & Filter Controls -->
      <div class="control-row">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            [formControl]="searchControl" 
            placeholder="Buscar estudiante por nombre..."
            class="search-input">
        </div>
      </div>

      <!-- Loading Indicator -->
      <div *ngIf="isLoading" class="loading-spinner">
        <span class="spinner"></span>
        <span class="loading-text">Cargando estudiantes...</span>
      </div>

      <!-- Students Table Card -->
      <mat-card class="table-card mat-mdc-card" *ngIf="!isLoading">
        <div class="table-responsive">
          <table class="students-table">
            <thead>
              <tr>
                <th (click)="toggleSort('name')">
                  Estudiante 
                  <span class="sort-indicator" *ngIf="sortBy === 'name'">{{ sortAsc ? '▲' : '▼' }}</span>
                </th>
                <th (click)="toggleSort('coherence')">
                  Coherencia 
                  <span class="sort-indicator" *ngIf="sortBy === 'coherence'">{{ sortAsc ? '▲' : '▼' }}</span>
                </th>
                <th (click)="toggleSort('risk')">
                  Riesgo 
                  <span class="sort-indicator" *ngIf="sortBy === 'risk'">{{ sortAsc ? '▲' : '▼' }}</span>
                </th>
                <th (click)="toggleSort('consistency')">
                  Consistencia 
                  <span class="sort-indicator" *ngIf="sortBy === 'consistency'">{{ sortAsc ? '▲' : '▼' }}</span>
                </th>
                <th (click)="toggleSort('totalDecisions')" class="text-center">
                  Decisiones 
                  <span class="sort-indicator" *ngIf="sortBy === 'totalDecisions'">{{ sortAsc ? '▲' : '▼' }}</span>
                </th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of filteredStudents" class="student-row">
                <td class="student-name">
                  <div class="avatar-circle">{{ s.name | slice:0:1 }}</div>
                  <span>{{ s.name }}</span>
                </td>
                <td>
                  <span class="score-chip" [ngClass]="getLabelClass(s.coherence)">
                    {{ s.coherence | percent:'1.0-0' }}
                  </span>
                </td>
                <td>
                  <span class="score-chip" [ngClass]="getLabelClass(s.risk)">
                    {{ s.risk | percent:'1.0-0' }}
                  </span>
                </td>
                <td>
                  <span class="score-chip" [ngClass]="getLabelClass(s.consistency)">
                    {{ s.consistency | percent:'1.0-0' }}
                  </span>
                </td>
                <td class="text-center font-mono text-secondary">
                  {{ s.totalDecisions }}
                </td>
                <td class="text-right">
                  <button 
                    mat-stroked-button 
                    color="primary" 
                    class="detail-btn"
                    [routerLink]="['/teacher/student', s.studentId]">
                    Ver detalle
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredStudents.length === 0">
                <td colspan="6" class="empty-state">
                  No se encontraron estudiantes que coincidan con la búsqueda.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .teacher-container {
      padding: 40px 16px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .subtitle {
      font-size: 10px;
      font-weight: 700;
      color: #00d4aa;
      letter-spacing: 0.1em;
    }

    .dashboard-header h1 {
      font-size: 32px;
      font-weight: 800;
      color: #e8e8f0;
      letter-spacing: -0.02em;
      margin-top: 4px;
    }

    .dashboard-header .description {
      color: #8b8fa8;
      font-size: 15px;
      margin-top: 4px;
    }

    .control-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .search-wrapper {
      position: relative;
      width: 100%;
      max-width: 400px;

      .search-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        color: #8b8fa8;
      }
    }

    .search-input {
      width: 100%;
      height: 44px;
      background-color: #1a1d2e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 0 16px 0 44px;
      color: #e8e8f0;
      font-size: 14px;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #6c63ff;
        box-shadow: 0 0 8px rgba(108, 99, 255, 0.15);
      }

      &::placeholder {
        color: #8b8fa8;
      }
    }

    .table-card {
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    .table-responsive {
      overflow-x: auto;
      width: 100%;
    }

    .students-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;

      th {
        padding: 16px 24px;
        background-color: rgba(255, 255, 255, 0.02);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        color: #8b8fa8;
        font-weight: 600;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: rgba(255, 255, 255, 0.04);
          color: #e8e8f0;
        }

        .sort-indicator {
          margin-left: 4px;
          font-size: 10px;
        }
      }

      td {
        padding: 16px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
      }
    }

    .student-row {
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.02);
      }
    }

    .student-name {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
      color: #e8e8f0;
    }

    .avatar-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(108, 99, 255, 0.15);
      border: 1px solid rgba(108, 99, 255, 0.3);
      color: #6c63ff;
      font-weight: 700;
      font-size: 12px;
    }

    .score-chip {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      font-family: monospace;

      &.level-high {
        background-color: rgba(107, 203, 119, 0.12);
        color: #6bcb77;
        border: 1px solid rgba(107, 203, 119, 0.3);
      }
      
      &.level-medium {
        background-color: rgba(255, 217, 61, 0.12);
        color: #ffd93d;
        border: 1px solid rgba(255, 217, 61, 0.3);
      }
      
      &.level-low {
        background-color: rgba(255, 107, 107, 0.12);
        color: #ff6b6b;
        border: 1px solid rgba(255, 107, 107, 0.3);
      }
    }

    .font-mono {
      font-family: monospace;
    }

    .text-secondary {
      color: #8b8fa8;
    }

    .text-center {
      text-align: center;
    }

    .text-right {
      text-align: right;
    }

    .detail-btn {
      border-color: rgba(255, 255, 255, 0.1) !important;
      color: #6c63ff !important;
      
      &:hover {
        background-color: rgba(108, 99, 255, 0.05) !important;
        border-color: rgba(108, 99, 255, 0.3) !important;
      }
    }

    .empty-state {
      text-align: center;
      padding: 48px !important;
      color: #8b8fa8;
      font-style: italic;
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
  `]
})
export class TeacherDashboardComponent implements OnInit {
  students: StudentSummary[] = [];
  filteredStudents: StudentSummary[] = [];
  searchControl = new FormControl('');
  isLoading = true;
  
  sortBy = 'name';
  sortAsc = true;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.profileService.getStudents().subscribe({
      next: (list) => {
        this.isLoading = false;
        this.students = list;
        this.filteredStudents = [...list];
        this.sortStudents();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.message, 'Cerrar', { duration: 4000 });
        this.cdr.markForCheck();
      }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.filterStudents(term || '');
      this.cdr.markForCheck();
    });
  }

  toggleSort(column: string) {
    if (this.sortBy === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortBy = column;
      this.sortAsc = true;
    }
    this.sortStudents();
  }

  sortStudents() {
    const col = this.sortBy;
    const asc = this.sortAsc;

    this.filteredStudents.sort((a, b) => {
      let valA: any = a[col as keyof StudentSummary];
      let valB: any = b[col as keyof StudentSummary];

      if (col === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }

      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ? 1 : -1;
      return 0;
    });
  }

  filterStudents(term: string) {
    const cleanTerm = term.toLowerCase().trim();
    if (!cleanTerm) {
      this.filteredStudents = [...this.students];
    } else {
      this.filteredStudents = this.students.filter(s => 
        s.name.toLowerCase().includes(cleanTerm)
      );
    }
    this.sortStudents();
  }

  getLabelClass(value: number): string {
    if (value >= 0.7) return 'level-high';
    if (value >= 0.4) return 'level-medium';
    return 'level-low';
  }
}
