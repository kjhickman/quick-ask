import React from 'react';
import { Provider } from '@config/constants';
import { useConfig } from '@hooks/useConfig';
import { ProviderSelector } from './ProviderSelector';
import { ConfigurationForm } from './ConfigurationForm';
import { SaveButton } from './SaveButton';
import { ErrorDisplay } from '@components/error-display/ErrorDisplay';

export function PopupApp(): React.ReactElement {
  const { config, loading, error, success, updateConfig, loadProviderConfig, saveConfig } =
    useConfig();

  const handleProviderChange = async (provider: Provider | ''): Promise<void> => {
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
    // This is called when the model field is focused
    // The actual default model setting is handled in ConfigurationForm
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
          provider={config.provider as Provider}
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
