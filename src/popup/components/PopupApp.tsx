import { ErrorDisplay } from '@shared/components/ErrorDisplay';
import type { ProviderType } from '@shared/config/constants';
import type React from 'react';
import { useConfig } from '../hooks/useConfig';
import { ConfigurationForm } from './ConfigurationForm';
import { ProviderSelector } from './ProviderSelector';
import { SaveButton } from './SaveButton';

export function PopupApp(): React.ReactElement {
  const { config, loading, error, success, updateConfig, loadProviderConfig, saveConfig } =
    useConfig();

  const handleProviderChange = async (provider: ProviderType | ''): Promise<void> => {
    updateConfig({ provider });

    if (provider) {
      await loadProviderConfig(provider);
    }
  };

  const handleApiKeyChange = (apiKey: string): void => {
    updateConfig({ apiKey });
  };

  const handleModelChange = (model: string): void => {
    updateConfig({ model });
  };

  const handleModelFocus = (): void => {
    // Default model setting is handled in ConfigurationForm
  };

  const handleSave = async (): Promise<boolean> => {
    return await saveConfig();
  };

  const showConfigurationForm = config.provider !== '';
  const showSaveButton = config.provider !== '';

  if (loading) {
    return (
      <div className="config-container">
        <div className="config-section">
          <div className="text-center">Loading configuration...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="config-container">
      <ProviderSelector value={config.provider} onChange={handleProviderChange} />

      {showConfigurationForm && (
        <ConfigurationForm
          provider={config.provider as ProviderType}
          apiKey={config.apiKey}
          model={config.model}
          onApiKeyChange={handleApiKeyChange}
          onModelChange={handleModelChange}
          onModelFocus={handleModelFocus}
        />
      )}

      <ErrorDisplay error={error} success={success} />

      {showSaveButton && (
        <div className="config-section">
          <SaveButton onSave={handleSave} />
        </div>
      )}
    </div>
  );
}
