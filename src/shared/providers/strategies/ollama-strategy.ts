import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  type ProviderType,
} from '../../config/constants';
import { BaseProviderStrategy } from './base-strategy';

interface OllamaMessage {
  role?: string;
  content?: string;
}

interface OllamaResponse {
  model?: string;
  created_at?: string;
  message?: OllamaMessage;
  done?: boolean;
}

export class OllamaStrategy extends BaseProviderStrategy {
  getProviderType(): ProviderType {
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
