import { DEFAULT_MODELS, PROVIDERS, STORAGE_KEYS, type Provider, type ApiConfig } from '../config/constants.js';

/**
 * Configuration Service for handling extension settings
 */
export default class ConfigService {
  /**
   * Load configuration from storage
   * @returns The saved configuration
   */
  static async loadConfig(): Promise<ApiConfig> {
    const config = await chrome.storage.sync.get(['apiKey', 'provider', 'model']);
    return {
      apiKey: config.apiKey || '',
      provider: (config.provider as Provider) || PROVIDERS.OPENAI,
      model: config.model || this.getDefaultModel(PROVIDERS.OPENAI)
    };
  }

  /**
   * Save configuration to storage
   * @param config - The configuration to save
   */
  static async saveConfig(config: ApiConfig): Promise<void> {
    await chrome.storage.sync.set({
      apiKey: config.apiKey,
      provider: config.provider,
      model: config.model
    });
  }

  /**
   * Get the default model for a provider
   * @param provider - The LLM provider
   * @returns The default model name
   */
  static getDefaultModel(provider: Provider): string {
    switch (provider) {
      case PROVIDERS.OPENAI:
        return DEFAULT_MODELS.openai;
      case PROVIDERS.ANTHROPIC:
        return DEFAULT_MODELS.anthropic;
      case PROVIDERS.LOCAL:
        return DEFAULT_MODELS.local;
      default:
        return DEFAULT_MODELS.openai;
    }
  }
}
