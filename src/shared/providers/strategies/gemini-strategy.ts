import {
  API_ENDPOINTS,
  DEFAULT_MODELS,
  type GeminiResponse,
  PROVIDERS,
  type Provider,
} from '../../config/constants';
import { BaseProviderStrategy } from './base-strategy';

export class GeminiStrategy extends BaseProviderStrategy {
  getProviderType(): Provider {
    return PROVIDERS.GEMINI;
  }

  getEndpointUrl(): string {
    return API_ENDPOINTS.GEMINI;
  }

  getDefaultModel(): string {
    return DEFAULT_MODELS.gemini;
  }

  buildHeaders(_apiKey?: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  buildRequestBody(
    messages: Array<{ role: string; content: string }>,
    _model: string
  ): Record<string, unknown> {
    // Convert messages to Gemini format
    const contents = messages
      .filter(msg => msg.role !== 'system') // Gemini handles system messages differently
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    // Add system instruction if present
    const systemMessage = messages.find(msg => msg.role === 'system');

    return {
      contents,
      ...(systemMessage && {
        systemInstruction: {
          parts: [{ text: systemMessage.content }],
        },
      }),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    };
  }

  createRequestConfig(query: string, config: { apiKey?: string; model?: string }) {
    const requestConfig = super.createRequestConfig(query, {
      provider: this.getProviderType(),
      apiKey: config.apiKey || '',
      model: config.model,
    });

    // Replace {{model}} placeholder in URL with actual model
    const model = config.model || this.getDefaultModel();
    requestConfig.url = requestConfig.url.replace('{{model}}', model);

    // Add API key as query parameter for Gemini
    if (config.apiKey) {
      requestConfig.url += `?key=${config.apiKey}&alt=sse`;
    }

    return requestConfig;
  }

  parseResponseChunk(data: string): string {
    const parsed = this.safeJsonParse<GeminiResponse>(data);
    return parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}
