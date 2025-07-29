import { type ApiConfig, ERROR_MESSAGES } from '../config/constants';

// Error types
export interface StandardError {
  type: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Centralized error handling service
 */
export class ErrorService {
  /**
   * Format API error response
   * @param response - The fetch response object
   * @returns Formatted error message
   */
  static formatApiError(response: Response): string {
    return `HTTP ${response.status}: ${response.statusText}`;
  }

  /**
   * Check if configuration is missing required fields
   * @param config - The configuration object
   * @returns True if configuration is invalid
   */
  static isConfigurationError(config: ApiConfig): boolean {
    return !config.apiKey && config.provider !== 'lmstudio' && config.provider !== 'ollama';
  }

  /**
   * Get configuration error message
   * @returns Configuration error message
   */
  static getConfigurationErrorMessage(): string {
    return ERROR_MESSAGES.NO_API_KEY;
  }

  /**
   * Handle and format different types of errors
   * @param error - The error to handle
   * @param config - Optional API configuration for context
   * @returns User-friendly error message
   */
  static handleError(error: Error | string, config?: ApiConfig): string {
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

  /**
   * Create a standardized error object
   * @param type - Error type
   * @param message - Error message
   * @param details - Additional error details
   * @returns Standardized error object
   */
  static createError(
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

  /**
   * Display error in UI element
   * @param elementId - The element ID to display error in
   * @param error - The error to display
   * @param config - Optional API configuration for context
   */
  static displayError(elementId: string, error: string | Error, config?: ApiConfig): void {
    const element = document.getElementById(elementId);
    if (element) {
      const message = ErrorService.handleError(error, config);
      element.textContent = message;
      element.style.color = 'red';
      element.style.display = 'block';
    }
  }

  /**
   * Clear error display
   * @param elementId - The element ID to clear
   */
  static clearError(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = '';
      element.style.display = 'none';
    }
  }
}
