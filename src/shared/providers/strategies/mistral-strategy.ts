import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  type MistralResponse,
  PROVIDERS,
  type Provider,
} from '../../config/constants';
import { BaseProviderStrategy } from './base-strategy';

export class MistralStrategy extends BaseProviderStrategy {
  getProviderType(): Provider {
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
