import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  UI_CONSTANTS,
  type Provider,
  type ApiConfig,
  type RequestConfig,
  type OpenAIResponse,
} from '../../config/constants';
import { LLMProviderStrategy } from './llm-provider-strategy';

/**
 * OpenAI provider strategy implementation
 */
export class OpenAIStrategy implements LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { apiKey, model } = config;

    const messages: Array<{ role: string; content: string }> = [];

    // Add static system prompt
    messages.push({ role: 'system', content: UI_CONSTANTS.SYSTEM_PROMPT });

    // Add user query
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
