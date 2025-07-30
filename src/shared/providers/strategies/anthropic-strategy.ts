import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  type ProviderType,
} from '../../config/constants';
import { BaseProviderStrategy } from './base-strategy';

interface AnthropicDelta {
  text?: string;
}

interface AnthropicResponse {
  type?: string;
  delta?: AnthropicDelta;
}

export class AnthropicStrategy extends BaseProviderStrategy {
  getProviderType(): ProviderType {
    return PROVIDERS.ANTHROPIC;
  }

  getEndpointUrl(): string {
    return API_ENDPOINTS.ANTHROPIC;
  }

  getDefaultModel(): string {
    return DEFAULT_MODELS.anthropic;
  }

  buildHeaders(apiKey?: string): Record<string, string> {
    return {
      'x-api-key': apiKey || '',
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    };
  }

  buildRequestBody(
    messages: Array<{ role: string; content: string }>,
    model: string
  ): Record<string, unknown> {
    // Anthropic expects different format - separate system and user messages
    const userMessage = messages.find(m => m.role === 'user');
    const systemMessage = messages.find(m => m.role === 'system');

    return {
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: userMessage?.content || '' }],
      stream: true,
      system: systemMessage?.content || '',
    };
  }

  parseResponseChunk(data: string): string {
    const parsed = this.safeJsonParse<AnthropicResponse>(data);
    if (parsed?.type === 'content_block_delta') {
      return parsed.delta?.text || '';
    }
    return '';
  }
}
