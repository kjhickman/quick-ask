import type { ApiConfig, Provider, RequestConfig } from '../config/constants';
import { LLMStrategyFactory } from '../services/strategies/llm-strategy-factory';

export function createRequestConfig(query: string, config: ApiConfig): RequestConfig {
  const strategy = LLMStrategyFactory.getStrategy(config.provider);
  return strategy.createRequestConfig(query, config);
}

export function parseResponseChunk(data: string, provider: Provider): string {
  const strategy = LLMStrategyFactory.getStrategy(provider);
  return strategy.parseResponseChunk(data);
}

export function getAvailableProviders(): Provider[] {
  return LLMStrategyFactory.getAvailableProviders();
}

const ApiUtils = {
  createRequestConfig,
  parseResponseChunk,
  getAvailableProviders,
};

export default ApiUtils;
