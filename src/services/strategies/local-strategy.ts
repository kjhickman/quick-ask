import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  type Provider,
  type ApiConfig,
  type RequestConfig,
  type LocalResponse,
} from '../../config/constants.js';
import { LLMProviderStrategy } from './llm-provider-strategy.js';

/**
 * Local LLM provider strategy implementation (e.g., Ollama)
 */
export class LocalStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { model } = config;

    return {
      url: API_ENDPOINTS.LOCAL,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        model: model || DEFAULT_MODELS.local,
        messages: [{ role: 'user', content: query }],
        stream: true,
      },
    };
  }

  parseResponseChunk(data: string): string {
    try {
      const parsed = JSON.parse(data);
      const localResponse = parsed as LocalResponse;
      return localResponse.message?.content || '';
    } catch (error) {
      console.error('Local: Error parsing chunk:', error);
      return '';
    }
  }

  getProviderType(): Provider {
    return PROVIDERS.LOCAL;
  }
}
