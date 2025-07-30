import { type ProviderType, UI_CONSTANTS } from '../../config/constants';
import type { ApiConfig, LLMProviderStrategy, RequestConfig } from '../types';

export abstract class BaseProviderStrategy implements LLMProviderStrategy {
  abstract getProviderType(): ProviderType;
  abstract getEndpointUrl(): string;
  abstract getDefaultModel(): string;
  abstract buildHeaders(apiKey?: string): Record<string, string>;
  abstract buildRequestBody(
    messages: Array<{ role: string; content: string }>,
    model: string
  ): Record<string, unknown>;
  abstract parseResponseChunk(data: string): string;

  createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const messages = [
      { role: 'system', content: UI_CONSTANTS.SYSTEM_PROMPT },
      { role: 'user', content: query },
    ];

    return {
      url: this.getEndpointUrl(),
      headers: this.buildHeaders(config.apiKey),
      body: this.buildRequestBody(messages, config.model || this.getDefaultModel()),
    };
  }

  protected safeJsonParse<T>(data: string): T | null {
    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`${this.getProviderType()}: Error parsing chunk:`, error);
      return null;
    }
  }
}
