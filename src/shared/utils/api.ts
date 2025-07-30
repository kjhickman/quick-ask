import type { ProviderType } from '../config/constants';
import { getAvailableProviders, getStrategy } from '../providers';
import type { ApiConfig, RequestConfig } from '../providers/types';

export function createRequestConfig(query: string, config: ApiConfig): RequestConfig {
  const strategy = getStrategy(config.provider);
  return strategy.createRequestConfig(query, config);
}

export function parseResponseChunk(data: string, provider: ProviderType): string {
  const strategy = getStrategy(provider);
  return strategy.parseResponseChunk(data);
}

export { getAvailableProviders };
