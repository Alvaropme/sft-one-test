import { Injectable } from '@angular/core';
import { STORAGE_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setItem<T>(key: string, value: T, storage: 'local' | 'session' | 'cookie' = 'local'): void {
    const serializedValue = JSON.stringify(value);

    switch (storage) {
      case 'local':
        localStorage.setItem(key, serializedValue);
        break;
      case 'session':
        sessionStorage.setItem(key, serializedValue);
        break;
      case 'cookie':
        this.setCookie(key, serializedValue);
        break;
    }
  }

  getItem<T>(key: string, storage: 'local' | 'session' | 'cookie' = 'local'): T | null {
    let value: string | null = null;

    switch (storage) {
      case 'local':
        value = localStorage.getItem(key);
        break;
      case 'session':
        value = sessionStorage.getItem(key);
        break;
      case 'cookie':
        value = this.getCookie(key);
        break;
    }

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  removeItem(key: string, storage: 'local' | 'session' | 'cookie' = 'local'): void {
    switch (storage) {
      case 'local':
        localStorage.removeItem(key);
        break;
      case 'session':
        sessionStorage.removeItem(key);
        break;
      case 'cookie':
        this.deleteCookie(key);
        break;
    }
  }

  clear(storage: 'local' | 'session' | 'cookie' = 'local'): void {
    switch (storage) {
      case 'local':
        localStorage.clear();
        break;
      case 'session':
        sessionStorage.clear();
        break;
      case 'cookie':
        this.clearCookies();
        break;
    }
  }

  private setCookie(name: string, value: string): void {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const match = document.cookie
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith(nameEQ));
    return match ? decodeURIComponent(match.substring(nameEQ.length)) : null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  private clearCookies(): void {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      this.deleteCookie(name.trim());
    }
  }

  getFavorites(): number[] {
    return this.getItem<number[]>(STORAGE_CONFIG.localStorageKeys.favorites) ?? [];
  }

  setFavorites(favorites: number[]): void {
    this.setItem(STORAGE_CONFIG.localStorageKeys.favorites, favorites);
  }

  getFilters(): Record<string, unknown> | null {
    return this.getItem<Record<string, unknown>>(STORAGE_CONFIG.sessionStorageKeys.filters, 'session');
  }

  setFilters(filters: Record<string, unknown>): void {
    this.setItem(STORAGE_CONFIG.sessionStorageKeys.filters, filters, 'session');
  }

  getTheme(): string {
    return this.getItem<string>(STORAGE_CONFIG.cookieKeys.theme, 'cookie') ?? 'light';
  }

  setTheme(theme: string): void {
    this.setItem(STORAGE_CONFIG.cookieKeys.theme, theme, 'cookie');
  }

  getLanguage(): string {
    return this.getItem<string>(STORAGE_CONFIG.cookieKeys.language, 'cookie') ?? 'en';
  }

  setLanguage(language: string): void {
    this.setItem(STORAGE_CONFIG.cookieKeys.language, language, 'cookie');
  }
}
