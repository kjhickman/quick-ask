import { useState, useEffect } from 'react';
import { Provider, ApiConfig } from '@config/constants';
import ConfigService from '@services/config-service';
import { ErrorService } from '@services/error-service';

export interface ConfigState {
  provider: Provider | '';
  apiKey: string;
  model: string;
}

export function useConfig(): {
  config: ConfigState;
  loading: boolean;
  error: string | null;
  updateConfig: (updates: Partial<ConfigState>) => void;
  loadProviderConfig: (provider: Provider) => Promise<void>;
  saveConfig: () => Promise<boolean>;
  clearError: () => void;
  setError: (error: string | null) => void;
} {
  const [config, setConfig] = useState<ConfigState>({
    provider: '',
    apiKey: '',
    model: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const savedConfig = await ConfigService.loadConfig();

      setConfig({
        provider: savedConfig.provider || '',
        apiKey: savedConfig.apiKey || '',
        model: savedConfig.model || '',
      });
    } catch (err) {
      setError(ErrorService.handleError(err as Error));
    } finally {
      setLoading(false);
    }
  };

  const loadProviderConfig = async (provider: Provider): Promise<void> => {
    try {
      setError(null);
      const providerConfig = await ConfigService.loadProviderConfig(provider);

      setConfig(prev => ({
        ...prev,
        apiKey: providerConfig.apiKey || '',
        model: providerConfig.model || ConfigService.getDefaultModel(provider),
      }));
    } catch (err) {
      setError(ErrorService.handleError(err as Error));
    }
  };

  const updateConfig = (updates: Partial<ConfigState>): void => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const saveConfig = async (): Promise<boolean> => {
    try {
      setError(null);

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
        provider: config.provider as Provider,
        apiKey: config.apiKey,
        model: config.model || ConfigService.getDefaultModel(config.provider as Provider),
      };

      await ConfigService.saveConfig(configToSave);
      return true;
    } catch (err) {
      setError(ErrorService.handleError(err as Error));
      return false;
    }
  };

  const clearError = (): void => setError(null);

  return {
    config,
    loading,
    error,
    updateConfig,
    loadProviderConfig,
    saveConfig,
    clearError,
    setError,
  };
}
