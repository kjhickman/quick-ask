import { type ApiConfig, ERROR_MESSAGES } from '../config/constants';

export interface StandardError {
  type: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export function formatApiError(response: Response): string {
  return `HTTP ${response.status}: ${response.statusText}`;
}

export function isConfigurationError(config: ApiConfig): boolean {
  return !config.apiKey && config.provider !== 'lmstudio' && config.provider !== 'ollama';
}

export function getConfigurationErrorMessage(): string {
  return ERROR_MESSAGES.NO_API_KEY;
}

export function handleError(error: Error | string, config?: ApiConfig): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    if (config?.provider === 'lmstudio') {
      return ERROR_MESSAGES.LMSTUDIO_SERVER_ERROR;
    }
    if (config?.provider === 'ollama') {
      return ERROR_MESSAGES.OLLAMA_SERVER_ERROR;
    }
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (error.name === 'AbortError') {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }

  console.error('Unhandled error:', error);

  return error.message || ERROR_MESSAGES.API_ERROR;
}

export function createError(
  type: string,
  message: string,
  details?: Record<string, unknown>
): StandardError {
  return {
    type,
    message,
    details,
    timestamp: new Date().toISOString(),
  };
}

export function displayError(elementId: string, error: string | Error, config?: ApiConfig): void {
  const element = document.getElementById(elementId);
  if (element) {
    const message = handleError(error, config);
    element.textContent = message;
    element.style.color = 'red';
    element.style.display = 'block';
  }
}

export function clearError(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = '';
    element.style.display = 'none';
  }
}

export const ErrorService = {
  formatApiError,
  isConfigurationError,
  getConfigurationErrorMessage,
  handleError,
  createError,
  displayError,
  clearError,
};
