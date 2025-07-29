import type { ApiConfig, Provider, RequestConfig } from '../config/constants';
import { getAvailableProviders, getStrategy } from '../providers';

export function createRequestConfig(query: string, config: ApiConfig): RequestConfig {
  const strategy = getStrategy(config.provider);
  return strategy.createRequestConfig(query, config);
}

export function parseResponseChunk(data: string, provider: Provider): string {
  const strategy = getStrategy(provider);
  return strategy.parseResponseChunk(data);
}

export { getAvailableProviders };
