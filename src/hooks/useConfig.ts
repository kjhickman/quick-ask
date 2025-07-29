import type { ApiConfig, Provider } from '@config/constants';
import ConfigService from '@services/config-service';
import { ErrorService } from '@services/error-service';
import { useCallback, useEffect, useState } from 'react';

export interface ConfigState {
  provider: Provider | '';
  apiKey: string;
  model: string;
}

export function useConfig(): {
  config: ConfigState;
  loading: boolean;
  error: string | null;
  success: string | null;
  updateConfig: (updates: Partial<ConfigState>) => void;
  loadProviderConfig: (provider: Provider) => Promise<void>;
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
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const loadProviderConfig = async (provider: Provider): Promise<void> => {
    try {
      setError(null);
      setSuccess(null);
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
        provider: config.provider as Provider,
        apiKey: config.apiKey,
        model: config.model || ConfigService.getDefaultModel(config.provider as Provider),
      };

      await ConfigService.saveConfig(configToSave);
      setSuccess('Configuration saved successfully! Try typing "ask" in the address bar.');
      return true;
    } catch (err) {
      setError(ErrorService.handleError(err as Error));
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
