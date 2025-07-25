import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  UI_CONSTANTS,
  type Provider,
  type ApiConfig,
  type RequestConfig,
  type OllamaResponse,
} from '../../config/constants.js';
import { LLMProviderStrategy } from './llm-provider-strategy.js';

/**
 * Ollama provider strategy implementation
 * Uses Ollama's native API format
 */
export class OllamaStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { model } = config;

    const messages: Array<{ role: string; content: string }> = [];

    // Add static system prompt
    messages.push({ role: 'system', content: UI_CONSTANTS.SYSTEM_PROMPT });

    // Add user query
    messages.push({ role: 'user', content: query });

    return {
      url: API_ENDPOINTS.OLLAMA,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        model: model || DEFAULT_MODELS.ollama,
        messages,
        stream: true,
      },
    };
  }

  parseResponseChunk(data: string): string {
    try {
      const parsed = JSON.parse(data);
      const ollamaResponse = parsed as OllamaResponse;
      return ollamaResponse.message?.content || '';
    } catch (error) {
      console.error('Ollama: Error parsing chunk:', error);
      return '';
    }
  }

  getProviderType(): Provider {
    return PROVIDERS.OLLAMA;
  }
}
