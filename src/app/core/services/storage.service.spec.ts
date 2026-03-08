import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    service = new StorageService();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('localStorage', () => {
    it('should set and get item', () => {
      service.setItem('testKey', { name: 'test' }, 'local');
      const result = service.getItem<{ name: string }>('testKey', 'local');
      expect(result).toEqual({ name: 'test' });
    });

    it('should return null for non-existent key', () => {
      const result = service.getItem('nonExistent', 'local');
      expect(result).toBeNull();
    });

    it('should remove item', () => {
      service.setItem('testKey', 'value', 'local');
      service.removeItem('testKey', 'local');
      const result = service.getItem('testKey', 'local');
      expect(result).toBeNull();
    });

    it('should clear all local storage', () => {
      service.setItem('key1', 'value1', 'local');
      service.setItem('key2', 'value2', 'local');
      service.clear('local');
      expect(localStorage.length).toBe(0);
    });
  });

  describe('sessionStorage', () => {
    it('should set and get item', () => {
      service.setItem('sessionKey', { name: 'sessionTest' }, 'session');
      const result = service.getItem<{ name: string }>('sessionKey', 'session');
      expect(result).toEqual({ name: 'sessionTest' });
    });
  });

  describe('favorites', () => {
    it('should save and retrieve favorites', () => {
      const favorites = [1, 2, 3];
      service.setFavorites(favorites);
      const result = service.getFavorites();
      expect(result).toEqual(favorites);
    });
  });

  describe('filters', () => {
    it('should save and retrieve filters from session storage', () => {
      const filters = { completed: true, search: 'test' };
      service.setFilters(filters);
      const result = service.getFilters();
      expect(result).toEqual(filters);
    });
  });

  describe('theme', () => {
    it('should save and retrieve theme', () => {
      service.setTheme('dark');
      const result = service.getTheme();
      expect(result).toBe('dark');
    });
  });

  describe('language', () => {
    it('should save and retrieve language', () => {
      service.setLanguage('es');
      const result = service.getLanguage();
      expect(result).toBe('es');
    });
  });
});
