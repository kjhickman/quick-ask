import React from 'react';
import { Provider } from '@config/constants';
import ConfigService from '@services/config-service';

export interface ConfigurationFormProps {
  provider: Provider | '';
  apiKey: string;
  model: string;
  onApiKeyChange: (apiKey: string) => void;
  onModelChange: (model: string) => void;
  onModelFocus: () => void;
  className?: string;
}

export function ConfigurationForm({
  provider,
  apiKey,
  model,
  onApiKeyChange,
  onModelChange,
  onModelFocus,
  className = '',
}: ConfigurationFormProps): React.ReactElement | null {
  if (!provider) {
    return null;
  }

  const isCloudProvider = provider === 'openai' || provider === 'anthropic';
  const defaultModel = ConfigService.getDefaultModel(provider);

  const getApiKeyHelp = (): string => {
    switch (provider) {
      case 'openai':
        return 'Get your API key from platform.openai.com';
      case 'anthropic':
        return 'Get your API key from console.anthropic.com';
      default:
        return '';
    }
  };

  const getModelHelp = (): string => {
    switch (provider) {
      case 'openai':
        return 'e.g., gpt-4o-mini, gpt-4o, gpt-3.5-turbo';
      case 'anthropic':
        return 'e.g., claude-3-5-haiku-latest, claude-3-5-sonnet-latest';
      case 'lmstudio':
        return 'Use the exact model name shown in LM Studio';
      case 'ollama':
        return 'e.g., llama3.1:8b, gemma2:9b, codellama:7b';
      default:
        return '';
    }
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onApiKeyChange(event.target.value);
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onModelChange(event.target.value);
  };

  const handleModelFocus = (): void => {
    if (!model || model.trim() === '') {
      onModelChange(defaultModel);
    }
    onModelFocus();
  };

  return (
    <div className={`provider-config ${className}`}>
      {isCloudProvider && (
        <div className="config-section">
          <h3 className="step-title">Enter your API key</h3>
          <label htmlFor="apiKey" className="form-label">
            API Key:
          </label>
          <input
            type="password"
            id="apiKey"
            className="form-input"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
          <div className="help-text">
            <span>{getApiKeyHelp()}</span>
          </div>
        </div>
      )}

      <div className="config-section">
        <h3 className="step-title">Configure your model</h3>
        <label htmlFor="model" className="form-label">
          Model:
        </label>
        <input
          type="text"
          id="model"
          className="form-input"
          placeholder={defaultModel}
          value={model}
          onChange={handleModelChange}
          onFocus={handleModelFocus}
        />
        <div className="help-text">
          <span>{getModelHelp()}</span>
        </div>
      </div>
    </div>
  );
}
