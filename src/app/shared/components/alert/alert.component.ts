import { Component, inject, effect, signal, computed, DestroyRef, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ErrorService } from '../../../core/services/error.service';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  private readonly errorService = inject(ErrorService);
  private readonly destroyRef = inject(DestroyRef);

  readonly message = signal('');
  readonly type = signal<AlertType>('info');
  readonly visible = signal(false);

  readonly useErrorService = input(false);
  readonly dismissible = input(true);
  readonly autoDismiss = input(false);
  readonly autoDismissTime = input(5000);
  readonly closed = output<void>();

  readonly icon = computed(() => {
    const icons: Record<AlertType, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
    };
    return icons[this.type()];
  });

  private timeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      if (!this.useErrorService()) return;
      const error = this.errorService.error();
      if (error) {
        this.message.set(error);
        this.type.set('error');
        this.show();
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.timeoutId) clearTimeout(this.timeoutId);
    });
  }

  show(): void {
    this.visible.set(true);
    if (this.autoDismiss()) {
      this.timeoutId = setTimeout(() => this.close(), this.autoDismissTime());
    }
  }

  close(): void {
    this.visible.set(false);
    this.closed.emit();
    if (this.useErrorService()) {
      this.errorService.clearError();
    }
  }
}