import ApiService from '../../services/api-service.js';
import ConfigService from '../../services/config-service.js';
import { ErrorService } from '../../services/error-service.js';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner.js';
import { ErrorDisplay } from '../../components/error-display/error-display.js';
import { UrlUtils } from '../../utils/url-utils.js';
import { DomUtils } from '../../utils/dom-utils.js';
import type { ApiConfig } from '../../config/constants.js';

/**
 * Controller for the LLM response streaming
 */
class ResponseController {
  private responseElement: HTMLElement | null;
  private loadingSpinner: LoadingSpinner;
  private errorDisplay: ErrorDisplay;

  constructor() {
    this.responseElement = DomUtils.getElementById('responseText');
    this.loadingSpinner = new LoadingSpinner('loading');
    this.errorDisplay = new ErrorDisplay('error');

    this.init();
  }

  async init(): Promise<void> {
    let config: ApiConfig | undefined;

    try {
      const query = UrlUtils.getQueryParam('query');

      if (!query) {
        this.showError('No query provided');
        return;
      }

      DomUtils.setTextContent('queryText', query);

      config = await ConfigService.loadConfig();

      if (ErrorService.isConfigurationError(config)) {
        this.showError(ErrorService.getConfigurationErrorMessage());
        return;
      }

      await this.streamResponse(query, config);
    } catch (error) {
      this.showError(ErrorService.handleError(error as Error, config), config);
    }
  }

  /**
   * Stream the LLM response
   * @param query - The user's query
   * @param config - The API configuration
   */
  async streamResponse(query: string, config: ApiConfig): Promise<void> {
    try {
      this.loadingSpinner?.show();
      this.errorDisplay?.hide();

      const { url, headers, body } = ApiService.createRequestConfig(query, config);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(ErrorService.formatApiError(response));
      }

      this.loadingSpinner?.hide();
      DomUtils.toggleVisibility('responseText', true);

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let responseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          let data = '';

          if (line.startsWith('data: ')) {
            // SSE format (OpenAI, LM Studio)
            data = line.slice(6);
            if (data === '[DONE]') continue;
          } else if (line.trim() && line.trim().startsWith('{')) {
            // Raw JSON format (Ollama)
            data = line.trim();
          } else {
            continue;
          }

          const content = ApiService.parseResponseChunk(data, config.provider);

          if (content) {
            responseText += content;
            DomUtils.setTextContent('responseText', responseText);

            if (this.responseElement) {
              this.responseElement.scrollTop = this.responseElement.scrollHeight;
            }
          }
        }
      }
    } catch (error) {
      this.showError(ErrorService.handleError(error as Error), config);
    }
  }

  /**
   * Show an error message
   * @param message - The error message
   * @param _config - Optional API configuration for context (unused in this implementation)
   */
  private showError(message: string, _config?: ApiConfig): void {
    this.loadingSpinner?.hide();
    this.errorDisplay?.showError(message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ResponseController();
});
