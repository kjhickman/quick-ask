import React from 'react';
import { Provider } from '@config/constants';
import { useConfig } from '@hooks/useConfig';
import { ProviderSelector } from './ProviderSelector';
import { ConfigurationForm } from './ConfigurationForm';
import { SaveButton } from './SaveButton';
import { ErrorDisplay } from '../error-display/ErrorDisplay';

export function PopupApp(): React.ReactElement {
  const {
    config,
    loading,
    error,
    updateConfig,
    loadProviderConfig,
    saveConfig,
    clearError,
    setError,
  } = useConfig();

  const handleProviderChange = async (provider: Provider | ''): Promise<void> => {
    updateConfig({ provider });
    clearError();

    if (provider) {
      await loadProviderConfig(provider);
    }
  };

  const handleApiKeyChange = (apiKey: string): void => {
    updateConfig({ apiKey });
    clearError();
  };

  const handleModelChange = (model: string): void => {
    updateConfig({ model });
    clearError();
  };

  const handleModelFocus = (): void => {
    // This is called when the model field is focused
    // The actual default model setting is handled in ConfigurationForm
  };

  const handleSave = async (): Promise<boolean> => {
    const success = await saveConfig();

    if (success) {
      setError(null);
      // Set success message using setError with a success indicator
      // Since our hook doesn't have a separate success state, we'll use the ErrorDisplay success prop
      setTimeout(() => {
        setError('Configuration saved successfully! Try typing "ask" in the address bar.');
      }, 100);
    }

    return success;
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

  // Check if the error is actually a success message
  const isSuccessMessage = error?.includes('Configuration saved successfully!');
  const errorMessage = isSuccessMessage ? null : error;
  const successMessage = isSuccessMessage ? error : null;

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

      <ErrorDisplay error={errorMessage} success={successMessage} />

      {showSaveButton && (
        <div className="config-section">
          <SaveButton onSave={handleSave} />
        </div>
      )}
    </div>
  );
}
