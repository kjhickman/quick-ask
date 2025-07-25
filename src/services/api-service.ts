import { type Provider, type ApiConfig, type RequestConfig } from '../config/constants.js';
import { LLMStrategyFactory } from './strategies/llm-strategy-factory.js';

/**
 * API Service for handling LLM provider communication using Strategy pattern
 */
export default class ApiService {
  /**
   * Create request configuration for the appropriate LLM provider
   * @param query - The user's query
   * @param config - The API configuration
   * @returns URL, headers, and body for the request
   */
  static createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const strategy = LLMStrategyFactory.getStrategy(config.provider);
    return strategy.createRequestConfig(query, config);
  }

  /**
   * Parse a chunk of streamed response based on the provider
   * @param data - The data chunk
   * @param provider - The LLM provider
   * @returns The parsed content
   */
  static parseResponseChunk(data: string, provider: Provider): string {
    const strategy = LLMStrategyFactory.getStrategy(provider);
    return strategy.parseResponseChunk(data);
  }

  /**
   * Get all available LLM providers
   * @returns Array of supported provider types
   */
  static getAvailableProviders(): Provider[] {
    return LLMStrategyFactory.getAvailableProviders();
  }
}
