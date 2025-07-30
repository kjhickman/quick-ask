import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  type ProviderType,
} from '../../config/constants';
import { BaseProviderStrategy } from './base-strategy';

interface MistralChoice {
  delta?: {
    content?: string;
  };
}

interface MistralResponse {
  choices?: MistralChoice[];
}

export class MistralStrategy extends BaseProviderStrategy {
  getProviderType(): ProviderType {
    return PROVIDERS.MISTRAL;
  }

  getEndpointUrl(): string {
    return API_ENDPOINTS.MISTRAL;
  }

  getDefaultModel(): string {
    return DEFAULT_MODELS.mistral;
  }

  buildHeaders(apiKey?: string): Record<string, string> {
    return {
      Authorization: `Bearer ${apiKey}`,
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
    const parsed = this.safeJsonParse<MistralResponse>(data);
    return parsed?.choices?.[0]?.delta?.content || '';
  }
}
