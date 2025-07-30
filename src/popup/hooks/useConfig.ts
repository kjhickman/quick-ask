import type { ProviderType } from '@shared/config/constants';
import type { ApiConfig } from '@shared/providers/types';
import { getDefaultModel, loadConfig, loadProviderConfig, saveConfig } from '@shared/utils/config';
import { getErrorMessage, requiresApiKey } from '@shared/utils/error';
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

  const loadConfigFromStorage = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const savedConfig = await loadConfig();

      setConfig({
        provider: savedConfig.provider || '',
        apiKey: savedConfig.apiKey || '',
        model: savedConfig.model || '',
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfigFromStorage();
  }, [loadConfigFromStorage]);

  const loadProviderConfigFromStorage = async (provider: ProviderType): Promise<void> => {
    try {
      setError(null);
      setSuccess(null);
      const providerConfig = await loadProviderConfig(provider);

      setConfig(prev => ({
        ...prev,
        apiKey: providerConfig.apiKey || '',
        model: providerConfig.model || getDefaultModel(provider),
      }));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const updateConfig = (updates: Partial<ConfigState>): void => {
    setConfig(prev => ({ ...prev, ...updates }));
    setError(null);
    setSuccess(null);
  };

  const saveConfigToStorage = async (): Promise<boolean> => {
    try {
      setError(null);
      setSuccess(null);

      if (!config.provider) {
        setError('Please select a provider');
        return false;
      }

      if (!config.apiKey.trim() && requiresApiKey(config.provider as ProviderType)) {
        setError('API key is required for cloud providers');
        return false;
      }

      const configToSave: ApiConfig = {
        provider: config.provider as ProviderType,
        apiKey: config.apiKey,
        model: config.model || getDefaultModel(config.provider as ProviderType),
      };

      await saveConfig(configToSave);
      setSuccess('Configuration saved successfully! Try typing "ask" in the address bar.');
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
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
    loadProviderConfig: loadProviderConfigFromStorage,
    saveConfig: saveConfigToStorage,
    clearError,
    clearSuccess,
    setError,
  };
}
