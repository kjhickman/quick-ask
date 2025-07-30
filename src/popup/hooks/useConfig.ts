import type { ApiConfig, ProviderType } from '@shared/config/constants';
import {
  getDefaultModel,
  loadConfig as loadStoredConfig,
  loadProviderConfig as loadStoredProviderConfig,
  saveConfig as saveStoredConfig,
} from '@shared/utils/config';
import { handleError } from '@shared/utils/error';
import { useCallback, useEffect, useState } from 'react';

export interface ConfigState {
  provider: ProviderType | '';
  apiKey: string;
  model: string;
}

export function useConfig(): {
  config: ConfigState;
  loading: boolean;
  error: string | null;
  success: string | null;
  updateConfig: (updates: Partial<ConfigState>) => void;
  loadProviderConfig: (provider: ProviderType) => Promise<void>;
  saveConfig: () => Promise<boolean>;
  clearError: () => void;
  clearSuccess: () => void;
  setError: (error: string | null) => void;
} {
  const [config, setConfig] = useState<ConfigState>({
    provider: '',
    apiKey: '',
    model: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadConfig = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const savedConfig = await loadStoredConfig();

      setConfig({
        provider: savedConfig.provider || '',
        apiKey: savedConfig.apiKey || '',
        model: savedConfig.model || '',
      });
    } catch (err) {
      setError(handleError(err as Error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const loadProviderConfig = async (provider: ProviderType): Promise<void> => {
    try {
      setError(null);
      setSuccess(null);
      const providerConfig = await loadStoredProviderConfig(provider);

      setConfig(prev => ({
        ...prev,
        apiKey: providerConfig.apiKey || '',
        model: providerConfig.model || getDefaultModel(provider),
      }));
    } catch (err) {
      setError(handleError(err as Error));
    }
  };

  const updateConfig = (updates: Partial<ConfigState>): void => {
    setConfig(prev => ({ ...prev, ...updates }));
    setError(null);
    setSuccess(null);
  };

  const saveConfig = async (): Promise<boolean> => {
    try {
      setError(null);
      setSuccess(null);

      if (!config.provider) {
        setError('Please select a provider');
        return false;
      }

      if (
        (config.provider === 'openai' || config.provider === 'anthropic') &&
        !config.apiKey.trim()
      ) {
        setError('API key is required for cloud providers');
        return false;
      }

      const configToSave: ApiConfig = {
        provider: config.provider as ProviderType,
        apiKey: config.apiKey,
        model: config.model || getDefaultModel(config.provider as ProviderType),
      };

      await saveStoredConfig(configToSave);
      setSuccess('Configuration saved successfully! Try typing "ask" in the address bar.');
      return true;
    } catch (err) {
      setError(handleError(err as Error));
      return false;
    }
  };

  const clearError = (): void => setError(null);
  const clearSuccess = (): void => setSuccess(null);

  return {
    config,
    loading,
    error,
    success,
    updateConfig,
    loadProviderConfig,
    saveConfig,
    clearError,
    clearSuccess,
    setError,
  };
}
