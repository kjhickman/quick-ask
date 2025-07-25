import { DEFAULT_MODELS, PROVIDERS, type Provider, type ApiConfig } from '../config/constants.js';

interface ProviderConfig {
  apiKey: string;
  model: string;
}

interface ProviderConfigs {
  [PROVIDERS.OPENAI]: ProviderConfig;
  [PROVIDERS.ANTHROPIC]: ProviderConfig;
  [PROVIDERS.LMSTUDIO]: ProviderConfig;
  [PROVIDERS.OLLAMA]: ProviderConfig;
}

/**
 * Configuration Service for handling extension settings with provider-specific memory
 */
export default class ConfigService {
  static async loadConfig(): Promise<ApiConfig> {
    await this.migrateOldConfigFormat();

    const result = await chrome.storage.sync.get(['currentProvider', 'providerConfigs']);
    const currentProvider = (result.currentProvider as Provider) || PROVIDERS.OPENAI;
    const providerConfigs = (result.providerConfigs as Partial<ProviderConfigs>) || {};

    const providerConfig = providerConfigs[currentProvider] || {
      apiKey: '',
      model: this.getDefaultModel(currentProvider),
    };

    return {
      apiKey: providerConfig.apiKey,
      provider: currentProvider,
      model: providerConfig.model,
    };
  }

  private static async migrateOldConfigFormat(): Promise<void> {
    const oldConfig = await chrome.storage.sync.get(['apiKey', 'provider', 'model']);

    if (oldConfig.apiKey || oldConfig.provider || oldConfig.model) {
      const newConfigCheck = await chrome.storage.sync.get(['currentProvider', 'providerConfigs']);

      if (!newConfigCheck.currentProvider && !newConfigCheck.providerConfigs) {
        const provider = (oldConfig.provider as Provider) || PROVIDERS.OPENAI;
        const providerConfigs: Partial<ProviderConfigs> = {};

        providerConfigs[provider] = {
          apiKey: oldConfig.apiKey || '',
          model: oldConfig.model || this.getDefaultModel(provider),
        };

        await chrome.storage.sync.set({
          currentProvider: provider,
          providerConfigs: providerConfigs,
        });

        await chrome.storage.sync.remove(['apiKey', 'provider', 'model']);
      }
    }
  }

  static async saveConfig(config: ApiConfig): Promise<void> {
    const result = await chrome.storage.sync.get(['providerConfigs']);
    const providerConfigs = (result.providerConfigs as Partial<ProviderConfigs>) || {};

    providerConfigs[config.provider] = {
      apiKey: config.apiKey,
      model: config.model || this.getDefaultModel(config.provider),
    };

    await chrome.storage.sync.set({
      currentProvider: config.provider,
      providerConfigs: providerConfigs,
    });
  }

  static async loadProviderConfig(provider: Provider): Promise<{ apiKey: string; model: string }> {
    const result = await chrome.storage.sync.get(['providerConfigs']);
    const providerConfigs = (result.providerConfigs as Partial<ProviderConfigs>) || {};

    return (
      providerConfigs[provider] || {
        apiKey: '',
        model: this.getDefaultModel(provider),
      }
    );
  }

  static async getAllProviderConfigs(): Promise<Partial<ProviderConfigs>> {
    const result = await chrome.storage.sync.get(['providerConfigs']);
    return (result.providerConfigs as Partial<ProviderConfigs>) || {};
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
      case PROVIDERS.LMSTUDIO:
        return DEFAULT_MODELS.lmstudio;
      case PROVIDERS.OLLAMA:
        return DEFAULT_MODELS.ollama;
      default:
        return DEFAULT_MODELS.openai;
    }
  }
}
