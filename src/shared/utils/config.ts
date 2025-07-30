import { DEFAULT_MODELS, PROVIDERS, type ProviderType } from '../config/constants';
import type { ApiConfig } from '../providers/types';

interface ProviderConfig {
  apiKey: string;
  model: string;
}

interface ProviderConfigs {
  [PROVIDERS.OPENAI]: ProviderConfig;
  [PROVIDERS.ANTHROPIC]: ProviderConfig;
  [PROVIDERS.LMSTUDIO]: ProviderConfig;
  [PROVIDERS.OLLAMA]: ProviderConfig;
  [PROVIDERS.MISTRAL]: ProviderConfig;
  [PROVIDERS.GEMINI]: ProviderConfig;
}

export function getDefaultModel(provider: ProviderType): string {
  switch (provider) {
    case PROVIDERS.OPENAI:
      return DEFAULT_MODELS.openai;
    case PROVIDERS.ANTHROPIC:
      return DEFAULT_MODELS.anthropic;
    case PROVIDERS.LMSTUDIO:
      return DEFAULT_MODELS.lmstudio;
    case PROVIDERS.OLLAMA:
      return DEFAULT_MODELS.ollama;
    case PROVIDERS.MISTRAL:
      return DEFAULT_MODELS.mistral;
    case PROVIDERS.GEMINI:
      return DEFAULT_MODELS.gemini;
    default:
      return DEFAULT_MODELS.openai;
  }
}

async function migrateOldConfigFormat(): Promise<void> {
  const oldConfig = await chrome.storage.sync.get(['apiKey', 'provider', 'model']);

  if (oldConfig.apiKey || oldConfig.provider || oldConfig.model) {
    const newConfigCheck = await chrome.storage.sync.get(['currentProvider', 'providerConfigs']);

    if (!newConfigCheck.currentProvider && !newConfigCheck.providerConfigs) {
      const provider = (oldConfig.provider as ProviderType) || PROVIDERS.OPENAI;
      const providerConfigs: Partial<ProviderConfigs> = {};

      providerConfigs[provider] = {
        apiKey: oldConfig.apiKey || '',
        model: oldConfig.model || getDefaultModel(provider),
      };

      await chrome.storage.sync.set({
        currentProvider: provider,
        providerConfigs: providerConfigs,
      });

      await chrome.storage.sync.remove(['apiKey', 'provider', 'model']);
    }
  }
}

export async function loadConfig(): Promise<ApiConfig> {
  await migrateOldConfigFormat();

  const result = await chrome.storage.sync.get(['currentProvider', 'providerConfigs']);
  const currentProvider = (result.currentProvider as ProviderType) || PROVIDERS.OPENAI;
  const providerConfigs = (result.providerConfigs as Partial<ProviderConfigs>) || {};

  const providerConfig = providerConfigs[currentProvider] || {
    apiKey: '',
    model: getDefaultModel(currentProvider),
  };

  return {
    apiKey: providerConfig.apiKey,
    provider: currentProvider,
    model: providerConfig.model,
  };
}

export async function saveConfig(config: ApiConfig): Promise<void> {
  const result = await chrome.storage.sync.get(['providerConfigs']);
  const providerConfigs = (result.providerConfigs as Partial<ProviderConfigs>) || {};

  providerConfigs[config.provider] = {
    apiKey: config.apiKey,
    model: config.model || getDefaultModel(config.provider),
  };

  await chrome.storage.sync.set({
    currentProvider: config.provider,
    providerConfigs: providerConfigs,
  });
}

export async function loadProviderConfig(
  provider: ProviderType
): Promise<{ apiKey: string; model: string }> {
  const result = await chrome.storage.sync.get(['providerConfigs']);
  const providerConfigs = (result.providerConfigs as Partial<ProviderConfigs>) || {};

  return (
    providerConfigs[provider] || {
      apiKey: '',
      model: getDefaultModel(provider),
    }
  );
}

export async function getAllProviderConfigs(): Promise<Partial<ProviderConfigs>> {
  const result = await chrome.storage.sync.get(['providerConfigs']);
  return (result.providerConfigs as Partial<ProviderConfigs>) || {};
}
