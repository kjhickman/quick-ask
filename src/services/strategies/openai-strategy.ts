import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  type Provider,
  type ApiConfig,
  type RequestConfig,
  type OpenAIResponse,
} from '../../config/constants.js';
import { LLMProviderStrategy } from './llm-provider-strategy.js';

/**
 * OpenAI provider strategy implementation
 */
export class OpenAIStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { apiKey, model } = config;

    return {
      url: API_ENDPOINTS.OPENAI,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: model || DEFAULT_MODELS.openai,
        messages: [{ role: 'user', content: query }],
        stream: true,
      },
    };
  }

  parseResponseChunk(data: string): string {
    try {
      const parsed = JSON.parse(data);
      const openaiResponse = parsed as OpenAIResponse;
      return openaiResponse.choices?.[0]?.delta?.content || '';
    } catch (error) {
      console.error('OpenAI: Error parsing chunk:', error);
      return '';
    }
  }

  getProviderType(): Provider {
    return PROVIDERS.OPENAI;
  }
}
