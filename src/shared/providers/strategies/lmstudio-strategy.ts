import {
  API_ENDPOINTS,
  type ApiConfig,
  DEFAULT_MODELS,
  type OpenAIResponse,
  PROVIDERS,
  type Provider,
  type RequestConfig,
  UI_CONSTANTS,
} from '../../config/constants';
import type { LLMProviderStrategy } from '../types';

export class LMStudioStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { model } = config;

    const messages: Array<{ role: string; content: string }> = [];

    messages.push({ role: 'system', content: UI_CONSTANTS.SYSTEM_PROMPT });
    messages.push({ role: 'user', content: query });

    return {
      url: API_ENDPOINTS.LMSTUDIO,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        model: model || DEFAULT_MODELS.lmstudio,
        messages,
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
