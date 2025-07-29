import {
  type AnthropicResponse,
  API_ENDPOINTS,
  type ApiConfig,
  DEFAULT_MODELS,
  PROVIDERS,
  type Provider,
  type RequestConfig,
  UI_CONSTANTS,
} from '../../config/constants';
import type { LLMProviderStrategy } from '../types';

export class AnthropicStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { apiKey, model } = config;

    const body: Record<string, unknown> = {
      model: model || DEFAULT_MODELS.anthropic,
      max_tokens: 4096,
      messages: [{ role: 'user', content: query }],
      stream: true,
      system: UI_CONSTANTS.SYSTEM_PROMPT,
    };

    return {
      url: API_ENDPOINTS.ANTHROPIC,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body,
    };
  }

  parseResponseChunk(data: string): string {
    try {
      const parsed = JSON.parse(data);
      const anthropicResponse = parsed as AnthropicResponse;

      if (anthropicResponse.type === 'content_block_delta') {
        return anthropicResponse.delta?.text || '';
      }

      return '';
    } catch (error) {
      console.error('Anthropic: Error parsing chunk:', error);
      return '';
    }
  }

  getProviderType(): Provider {
    return PROVIDERS.ANTHROPIC;
  }
}
