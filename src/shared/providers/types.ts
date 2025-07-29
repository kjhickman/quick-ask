import type { ApiConfig, Provider, RequestConfig } from '../config/constants';

export interface LLMProviderStrategy {
  createRequestConfig(query: string, config: ApiConfig): RequestConfig;
  parseResponseChunk(data: string): string;
  getProviderType(): Provider;
}
