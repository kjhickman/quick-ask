import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  type OpenAIResponse,
  PROVIDERS,
  type Provider,
} from '../../config/constants';
import { BaseProviderStrategy } from './base-strategy';

export class LMStudioStrategy extends BaseProviderStrategy {
  getProviderType(): Provider {
    return PROVIDERS.LMSTUDIO;
  }

  getEndpointUrl(): string {
    return API_ENDPOINTS.LMSTUDIO;
  }

  getDefaultModel(): string {
    return DEFAULT_MODELS.lmstudio;
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
      temperature: 0.7,
      max_tokens: 2000,
    };
  }

  parseResponseChunk(data: string): string {
    const parsed = this.safeJsonParse<OpenAIResponse>(data);
    return parsed?.choices?.[0]?.delta?.content || '';
  }
}
