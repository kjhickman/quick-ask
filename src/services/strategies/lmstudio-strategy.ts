import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  UI_CONSTANTS,
  type Provider,
  type ApiConfig,
  type RequestConfig,
  type OpenAIResponse,
} from '@config/constants';
import { LLMProviderStrategy } from './llm-provider-strategy';

/**
 * LM Studio provider strategy implementation
 * Uses OpenAI-compatible API format
 */
export class LMStudioStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { model } = config;

    const messages: Array<{ role: string; content: string }> = [];

    // Add static system prompt
    messages.push({ role: 'system', content: UI_CONSTANTS.SYSTEM_PROMPT });

    // Add user query
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
