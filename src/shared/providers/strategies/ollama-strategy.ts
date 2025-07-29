import {
  API_ENDPOINTS,
  type ApiConfig,
  DEFAULT_MODELS,
  type OllamaResponse,
  PROVIDERS,
  type Provider,
  type RequestConfig,
  UI_CONSTANTS,
} from '../../config/constants';
import type { LLMProviderStrategy } from '../types';

export class OllamaStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { model } = config;

    const messages: Array<{ role: string; content: string }> = [];

    messages.push({ role: 'system', content: UI_CONSTANTS.SYSTEM_PROMPT });
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
