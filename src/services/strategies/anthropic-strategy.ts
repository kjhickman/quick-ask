import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  type Provider,
  type ApiConfig,
  type RequestConfig,
  type AnthropicResponse,
} from '../../config/constants.js';
import { LLMProviderStrategy } from './llm-provider-strategy.js';

/**
 * Anthropic provider strategy implementation
 */
export class AnthropicStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { apiKey, model } = config;

    return {
      url: API_ENDPOINTS.ANTHROPIC,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: {
        model: model || DEFAULT_MODELS.anthropic,
        max_tokens: 4096,
        messages: [{ role: 'user', content: query }],
        stream: true,
      },
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
