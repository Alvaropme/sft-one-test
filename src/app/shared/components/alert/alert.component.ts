import { Component, Input, Output, EventEmitter, inject, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ErrorService } from '../../../core/services/error.service';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    @if (visible) {
      <div class="alert" [class]="'alert-' + type" role="alert">
        <mat-icon class="alert-icon">{{ getIcon() }}</mat-icon>
        <span class="alert-message">{{ message }}</span>
        @if (dismissible) {
          <button mat-icon-button class="alert-close" (click)="close()" aria-label="Close">
            <mat-icon>close</mat-icon>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    .alert {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-radius: 4px;
      margin: 8px 0;
      gap: 12px;
    }

    .alert-success {
      background-color: #e8f5e9;
      color: #2e7d32;
      border-left: 4px solid #2e7d32;
    }

    .alert-error {
      background-color: #ffebee;
      color: #c62828;
      border-left: 4px solid #c62828;
    }

    .alert-warning {
      background-color: #fff3e0;
      color: #ef6c00;
      border-left: 4px solid #ef6c00;
    }

    .alert-info {
      background-color: #e3f2fd;
      color: #1565c0;
      border-left: 4px solid #1565c0;
    }

    .alert-icon {
      flex-shrink: 0;
    }

    .alert-message {
      flex: 1;
    }

    .alert-close {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
  `]
})
export class AlertComponent implements OnDestroy {
  @Input() message = '';
  @Input() type: AlertType = 'info';
  @Input() dismissible = true;
  @Input() autoDismiss = false;
  @Input() autoDismissTime = 5000;
  @Input() useErrorService = false;

  @Output() closed = new EventEmitter<void>();

  visible = false;
  private errorService = inject(ErrorService);
  private timeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    if (this.useErrorService) {
      effect(() => {
        const error = this.errorService.error();
        if (error) {
          this.message = error;
          this.type = 'error';
          this.show();
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  show(): void {
    this.visible = true;
    if (this.autoDismiss) {
      this.timeoutId = setTimeout(() => this.close(), this.autoDismissTime);
    }
  }

  close(): void {
    this.visible = false;
    this.closed.emit();
    if (this.useErrorService) {
      this.errorService.clearError();
    }
  }

  getIcon(): string {
    switch (this.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
    }
  }
}
