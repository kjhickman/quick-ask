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
import type { LLMProviderStrategy } from './llm-provider-strategy';

export class OpenAIStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { apiKey, model } = config;

    const messages: Array<{ role: string; content: string }> = [];

    messages.push({ role: 'system', content: UI_CONSTANTS.SYSTEM_PROMPT });
    messages.push({ role: 'user', content: query });

    return {
      url: API_ENDPOINTS.OPENAI,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: model || DEFAULT_MODELS.openai,
        messages,
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
