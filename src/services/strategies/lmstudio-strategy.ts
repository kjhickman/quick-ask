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
 * LM Studio provider strategy implementation
 * Uses OpenAI-compatible API format
 */
export class LMStudioStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { model } = config;

    return {
      url: API_ENDPOINTS.LMSTUDIO,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        model: model || DEFAULT_MODELS.lmstudio,
        messages: [{ role: 'user', content: query }],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      },
    };
  }

  parseResponseChunk(data: string): string {
    try {
      const parsed = JSON.parse(data);
      const openAIResponse = parsed as OpenAIResponse;
      return openAIResponse.choices?.[0]?.delta?.content || '';
    } catch (error) {
      console.error('LMStudio: Error parsing chunk:', error);
      return '';
    }
  }

  getProviderType(): Provider {
    return PROVIDERS.LMSTUDIO;
  }
}
