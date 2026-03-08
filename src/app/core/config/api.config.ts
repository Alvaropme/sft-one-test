import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.api.baseUrl,
  todosEndpoint: environment.api.todosEndpoint,
  timeout: environment.api.timeout,
};

export const STORAGE_CONFIG = {
  localStorageKeys: environment.storage.localStorageKeys,
  sessionStorageKeys: environment.storage.sessionStorageKeys,
  cookieKeys: environment.storage.cookieKeys,
};

export const APP_CONFIG = {
  pagination: environment.pagination,
  debounceTime: environment.debounceTime,
};
