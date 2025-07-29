import type { ApiConfig, Provider, RequestConfig } from '../config/constants';
import { LLMStrategyFactory } from './strategies/llm-strategy-factory';

/**
 * Create request configuration for the appropriate LLM provider
 * @param query - The user's query
 * @param config - The API configuration
 * @returns URL, headers, and body for the request
 */
export function createRequestConfig(query: string, config: ApiConfig): RequestConfig {
  const strategy = LLMStrategyFactory.getStrategy(config.provider);
  return strategy.createRequestConfig(query, config);
}

/**
 * Parse a chunk of streamed response based on the provider
 * @param data - The data chunk
 * @param provider - The LLM provider
 * @returns The parsed content
 */
export function parseResponseChunk(data: string, provider: Provider): string {
  const strategy = LLMStrategyFactory.getStrategy(provider);
  return strategy.parseResponseChunk(data);
}

/**
 * Get all available LLM providers
 * @returns Array of supported provider types
 */
export function getAvailableProviders(): Provider[] {
  return LLMStrategyFactory.getAvailableProviders();
}

// Default export for backward compatibility
const ApiService = {
  createRequestConfig,
  parseResponseChunk,
  getAvailableProviders,
};

export default ApiService;
