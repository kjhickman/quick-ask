import { ERROR_MESSAGES } from '../config/constants';
import type { ApiConfig } from '../providers/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public provider?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message.includes('fetch');
}

export function getErrorMessage(error: unknown, config?: ApiConfig): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return ERROR_MESSAGES.TIMEOUT_ERROR;
    }

    if (isNetworkError(error)) {
      switch (config?.provider) {
        case 'lmstudio':
          return ERROR_MESSAGES.LMSTUDIO_SERVER_ERROR;
        case 'ollama':
          return ERROR_MESSAGES.OLLAMA_SERVER_ERROR;
        default:
          return ERROR_MESSAGES.NETWORK_ERROR;
      }
    }

    return error.message || ERROR_MESSAGES.API_ERROR;
  }

  return String(error);
}

export function requiresApiKey(provider: string): boolean {
  return (
    provider === 'openai' ||
    provider === 'anthropic' ||
    provider === 'mistral' ||
    provider === 'gemini'
  );
}
