import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  type ProviderType,
} from '../../config/constants';
import { BaseProviderStrategy } from './base-strategy';

interface OpenAIChoice {
  delta?: {
    content?: string;
  };
}

interface OpenAIResponse {
  choices?: OpenAIChoice[];
}

export class OpenAIStrategy extends BaseProviderStrategy {
  getProviderType(): ProviderType {
    return PROVIDERS.OPENAI;
  }

  getEndpointUrl(): string {
    return API_ENDPOINTS.OPENAI;
  }

  getDefaultModel(): string {
    return DEFAULT_MODELS.openai;
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
    const parsed = this.safeJsonParse<OpenAIResponse>(data);
    return parsed?.choices?.[0]?.delta?.content || '';
  }
}
