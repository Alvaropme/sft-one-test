import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSignal = signal<string | null>(null);

  get error() {
    return this.errorSignal.asReadonly();
  }

  setError(message: string): void {
    this.errorSignal.set(message);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
