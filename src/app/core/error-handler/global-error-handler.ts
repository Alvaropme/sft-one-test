import { Injectable, inject, ErrorHandler } from '@angular/core';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private loggingService = inject(LoggingService);

  handleError(error: Error): void {
    const message = error.message ?? 'Unknown error occurred';
    const stack = error.stack ?? 'No stack trace available';

    this.loggingService.error(`Unhandled Error: ${message}`, {
      name: error.name,
      message,
      stack,
      timestamp: new Date().toISOString(),
    });

    console.error('Global error handler caught:', error);
  }
}
