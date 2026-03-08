import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private storageService = inject(StorageService);
  private logs: LogEntry[] = [];
  private readonly maxLogs = 100;

  log(message: string, data?: unknown): void {
    this.addLog('log', message, data);
    console.log(`[LOG] ${new Date().toISOString()} - ${message}`, data ?? '');
  }

  info(message: string, data?: unknown): void {
    this.addLog('info', message, data);
    console.info(`[INFO] ${new Date().toISOString()} - ${message}`, data ?? '');
  }

  warn(message: string, data?: unknown): void {
    this.addLog('warn', message, data);
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data ?? '');
  }

  error(message: string, data?: unknown): void {
    this.addLog('error', message, data);
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, data ?? '');
  }

  debug(message: string, data?: unknown): void {
    this.addLog('debug', message, data);
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data ?? '');
  }

  logHttpError(status: number, url: string, error: unknown): void {
    const message = `HTTP Error ${status} - ${url}`;
    this.error(message, { status, url, error });
  }

  logEvent(event: string, data?: unknown): void {
    this.info(`Event: ${event}`, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  private addLog(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }
}
