import { DEFAULT_MODELS, PROVIDERS, type ProviderType } from '../config/constants';
import type { ApiConfig } from '../providers/types';

interface ProviderConfig {
  apiKey: string;
  model: string;
}

export type ProviderConfigs = Record<ProviderType, ProviderConfig>;

export interface StorageData {
  currentProvider?: ProviderType;
  providerConfigs?: Partial<ProviderConfigs>;
}

export async function loadConfig(): Promise<ApiConfig> {
  const { currentProvider = PROVIDERS.OPENAI, providerConfigs = {} } = await getStorageData();

  const providerConfig = providerConfigs[currentProvider] ?? {
    apiKey: '',
    model: getDefaultModel(currentProvider),
  };

  return {
    provider: currentProvider,
    apiKey: providerConfig.apiKey,
    model: providerConfig.model,
  };
}

async function getStorageData(): Promise<StorageData> {
  return chrome.storage.sync.get(['currentProvider', 'providerConfigs']) as Promise<StorageData>;
}

export function getDefaultModel(provider: ProviderType): string {
  return DEFAULT_MODELS[provider];
}

export async function saveConfig(config: ApiConfig): Promise<void> {
  const { providerConfigs = {} } = await getStorageData();

  providerConfigs[config.provider] = {
    apiKey: config.apiKey,
    model: config.model || getDefaultModel(config.provider),
  };

  const dataToSave: StorageData = {
    currentProvider: config.provider,
    providerConfigs: providerConfigs,
  };

  await chrome.storage.sync.set(dataToSave);
}

export async function loadProviderConfig(
  provider: ProviderType
): Promise<{ apiKey: string; model: string }> {
  const { providerConfigs = {} } = await getStorageData();

  return (
    providerConfigs[provider] || {
      apiKey: '',
      model: getDefaultModel(provider),
    }
  );
}

export async function getAllProviderConfigs(): Promise<Partial<ProviderConfigs>> {
  const { providerConfigs = {} } = await getStorageData();
  return providerConfigs;
}
