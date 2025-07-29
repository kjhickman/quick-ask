import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  type OllamaResponse,
  PROVIDERS,
  type Provider,
} from '../../config/constants';
import { BaseProviderStrategy } from './base-strategy';

export class OllamaStrategy extends BaseProviderStrategy {
  getProviderType(): Provider {
    return PROVIDERS.OLLAMA;
  }

  getEndpointUrl(): string {
    return API_ENDPOINTS.OLLAMA;
  }

  getDefaultModel(): string {
    return DEFAULT_MODELS.ollama;
  }

  buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  buildRequestBody(
    messages: Array<{ role: string; content: string }>,
    model: string
  ): Record<string, unknown> {
    return {
      model,
      messages,
      stream: true,
    };
  }

  parseResponseChunk(data: string): string {
    const parsed = this.safeJsonParse<OllamaResponse>(data);
    return parsed?.message?.content || '';
  }
}
