import type { ProviderType } from '../config/constants';

export interface ApiConfig {
  provider: ProviderType;
  apiKey: string;
  model?: string;
}

export interface RequestConfig {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}

export interface LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig;
  parseResponseChunk(data: string): string;
  getProviderType(): ProviderType;
}
