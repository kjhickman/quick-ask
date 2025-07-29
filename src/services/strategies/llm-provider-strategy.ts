import { Provider, type ApiConfig, type RequestConfig } from '../../config/constants';

/**
 * Base interface for LLM provider strategies
 */
export interface LLMProviderStrategy {
  /**
   * Create request configuration for this provider
   * @param query - The user's query
   * @param config - The API configuration
   * @returns Request configuration
   */
  createRequestConfig(query: string, config: ApiConfig): RequestConfig;

  /**
   * Parse a response chunk from this provider
   * @param data - The raw response chunk data
   * @returns The parsed content string
   */
  parseResponseChunk(data: string): string;

  /**
   * Get the provider type
   * @returns The provider identifier
   */
  getProviderType(): Provider;
}
