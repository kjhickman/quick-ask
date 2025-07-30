import type { ProviderType } from '@shared/config/constants';
import type React from 'react';

export interface ProviderSelectorProps {
  value: ProviderType | '';
  onChange: (provider: ProviderType | '') => void;
  className?: string;
}

export function ProviderSelector({
  value,
  onChange,
  className = '',
}: ProviderSelectorProps): React.ReactElement {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value as ProviderType | '');
  };

  return (
    <div className={`config-section ${className}`}>
      <h3 className="step-title">Choose your AI provider</h3>
      <label htmlFor="provider" className="form-label">
        LLM Provider:
      </label>
      <select id="provider" className="form-select" value={value} onChange={handleChange}>
        <option value="">Select a provider...</option>
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
        <option value="mistral">Mistral</option>
        <option value="gemini">Gemini</option>
        <option value="lmstudio">LM Studio (Local)</option>
        <option value="ollama">Ollama (Local)</option>
      </select>
    </div>
  );
}
