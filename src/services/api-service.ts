import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  PROVIDERS,
  type Provider,
  type ApiConfig,
  type RequestConfig,
  type OpenAIResponse,
  type AnthropicResponse,
  type LocalResponse,
} from '../config/constants.js';

/**
 * API Service for handling LLM provider communication
 */
export default class ApiService {
  /**
   * Create request configuration for the appropriate LLM provider
   * @param query - The user's query
   * @param config - The API configuration
   * @returns URL, headers, and body for the request
   */
  static createRequestConfig(query: string, config: ApiConfig): RequestConfig {
    const { provider, apiKey, model } = config;
    let url: string;
    let headers: Record<string, string>;
    let body: Record<string, unknown>;

    if (provider === PROVIDERS.OPENAI) {
      url = API_ENDPOINTS.OPENAI;
      headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };
      body = {
        model: model || DEFAULT_MODELS.openai,
        messages: [{ role: 'user', content: query }],
        stream: true,
      };
    } else if (provider === PROVIDERS.ANTHROPIC) {
      url = API_ENDPOINTS.ANTHROPIC;
      headers = {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      };
      body = {
        model: model || DEFAULT_MODELS.anthropic,
        max_tokens: 4096,
        messages: [{ role: 'user', content: query }],
        stream: true,
      };
    } else if (provider === PROVIDERS.LOCAL) {
      url = API_ENDPOINTS.LOCAL;
      headers = {
        'Content-Type': 'application/json',
      };
      body = {
        model: model || DEFAULT_MODELS.local,
        messages: [{ role: 'user', content: query }],
        stream: true,
      };
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    return { url, headers, body };
  }

  /**
   * Parse a chunk of streamed response based on the provider
   * @param data - The data chunk
   * @param provider - The LLM provider
   * @returns The parsed content
   */
  static parseResponseChunk(data: string, provider: Provider): string {
    try {
      const parsed = JSON.parse(data);
      let content = '';

      if (provider === PROVIDERS.OPENAI) {
        const openaiResponse = parsed as OpenAIResponse;
        content = openaiResponse.choices?.[0]?.delta?.content || '';
      } else if (provider === PROVIDERS.ANTHROPIC) {
        const anthropicResponse = parsed as AnthropicResponse;
        if (anthropicResponse.type === 'content_block_delta') {
          content = anthropicResponse.delta?.text || '';
        }
      } else if (provider === PROVIDERS.LOCAL) {
        const localResponse = parsed as LocalResponse;
        content = localResponse.message?.content || '';
      }

      return content;
    } catch (e) {
      console.error('Error parsing chunk:', e);
      return '';
    }
  }
}
