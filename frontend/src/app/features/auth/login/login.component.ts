import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-wrapper">
      <div class="glass-card animate-fade-in">
        <div class="logo-area">
          <div class="logo-glow"></div>
          <h1 class="logo-title">ThinkLab</h1>
          <p class="tagline">"Aprende a pensar, no solo a responder."</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Correo Electrónico</mat-label>
            <input matInput type="email" formControlName="email" placeholder="ejemplo@thinklab.edu.pe" autocomplete="username">
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">El correo es obligatorio</mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Formato de correo no válido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password" placeholder="••••••••" autocomplete="current-password">
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">La contraseña es obligatoria</mat-error>
            <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">Mínimo 6 caracteres</mat-error>
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">Ingresar</span>
            <span *ngIf="isLoading" class="spinner"></span>
          </button>
        </form>

        <div class="credentials-hint">
          <p><strong>Cuentas de demostración:</strong></p>
          <ul>
            <li>Estudiante: <span>j.vidaurre&#64;thinklab.edu.pe</span></li>
            <li>Docente: <span>j.pacheco&#64;thinklab.edu.pe</span></li>
            <li>Admin: <span>admin&#64;thinklab.edu.pe</span></li>
            <li class="pass-info">Contraseña: <span>ThinkLab2026!</span></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use "sass:color";

    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: radial-gradient(circle at 10% 20%, rgba(108, 99, 255, 0.05) 0%, rgba(15, 17, 23, 1) 90%);
      padding: 20px;
    }

    .glass-card {
      position: relative;
      width: 100%;
      max-width: 440px;
      padding: 40px;
      background: rgba(26, 29, 46, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
      overflow: hidden;
    }

    .logo-area {
      text-align: center;
      margin-bottom: 32px;
      position: relative;
    }

    .logo-glow {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 100px;
      background: #6c63ff;
      filter: blur(60px);
      opacity: 0.3;
      z-index: 0;
      pointer-events: none;
    }

    .logo-title {
      font-size: 36px;
      font-weight: 800;
      color: #e8e8f0;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #fff 0%, #8b8fa8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      z-index: 1;
      position: relative;
    }

    .tagline {
      font-size: 14px;
      color: #8b8fa8;
      font-style: italic;
      z-index: 1;
      position: relative;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .w-full {
      width: 100%;
    }

    // Material style overrides
    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: rgba(15, 17, 23, 0.5) !important;
    }

    ::ng-deep .mat-mdc-form-field-focus-indicator {
      border-color: #6c63ff !important;
    }

    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: rgba(255, 255, 255, 0.12) !important;
    }

    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__trailing {
      border-color: rgba(108, 99, 255, 0.5) !important;
    }

    ::ng-deep .mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: #6c63ff !important;
    }

    ::ng-deep .mat-mdc-form-field-label {
      color: #8b8fa8 !important;
    }

    ::ng-deep .mat-mdc-form-field-focus-indicator .mat-mdc-form-field-label {
      color: #6c63ff !important;
    }

    .submit-btn {
      height: 48px;
      border-radius: 8px !important;
      background-color: #6c63ff !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      color: #ffffff !important;
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

    .credentials-hint {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 12px;
      color: #8b8fa8;

      p {
        margin-bottom: 8px;
        color: #e8e8f0;
      }

      ul {
        list-style: none;
        padding-left: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      li span {
        color: #00d4aa;
        font-family: monospace;
      }

      .pass-info {
        margin-top: 4px;
        border-top: 1px dashed rgba(255, 255, 255, 0.05);
        padding-top: 4px;
        span {
          color: #ffd93d;
        }
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
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.snackBar.open('¡Ingreso exitoso!', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });

        // Redirect based on role decoded from token
        const decoded = this.authService.getDecodedToken();
        if (decoded?.role === 'student') {
          this.router.navigate(['/student/dashboard']);
        } else if (decoded?.role === 'teacher') {
          this.router.navigate(['/teacher/dashboard']);
        } else if (decoded?.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.message, 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
