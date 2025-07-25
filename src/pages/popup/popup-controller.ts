import ConfigService from '../../services/config-service.js';
import { ErrorService } from '../../services/error-service.js';
import { ErrorDisplay } from '../../components/error-display/error-display.js';
import { DomUtils } from '../../utils/dom-utils.js';
import { Provider } from '../../config/constants.js';

/**
 * Popup controller for managing extension configuration with progressive disclosure
 */
class PopupController {
  private apiKeyInput: HTMLInputElement | null;
  private providerSelect: HTMLSelectElement | null;
  private modelInput: HTMLInputElement | null;
  private saveButton: HTMLButtonElement | null;
  private errorDisplay: ErrorDisplay;

  // UI sections
  private providerConfigSection: HTMLElement | null;
  private apiKeySection: HTMLElement | null;
  private modelSection: HTMLElement | null;
  private localInstructionsSection: HTMLElement | null;
  private saveSection: HTMLElement | null;

  constructor() {
    this.apiKeyInput = DomUtils.getElementById('apiKey') as HTMLInputElement;
    this.providerSelect = DomUtils.getElementById('provider') as HTMLSelectElement;
    this.modelInput = DomUtils.getElementById('model') as HTMLInputElement;
    this.saveButton = DomUtils.getElementById('save') as HTMLButtonElement;
    this.errorDisplay = new ErrorDisplay('error');

    this.providerConfigSection = DomUtils.getElementById('providerConfig');
    this.apiKeySection = DomUtils.getElementById('apiKeySection');
    this.modelSection = DomUtils.getElementById('modelSection');
    this.localInstructionsSection = DomUtils.getElementById('localInstructions');
    this.saveSection = DomUtils.getElementById('saveSection');

    this.setupEventListeners();
    this.init();
  }

  async init(): Promise<void> {
    try {
      const config = await ConfigService.loadConfig();

      if (config.provider && this.providerSelect) {
        this.providerSelect.value = config.provider;
        this.showProviderConfiguration(config.provider);
      }

      if (config.apiKey && this.apiKeyInput) this.apiKeyInput.value = config.apiKey;
      if (config.model && this.modelInput) this.modelInput.value = config.model;

      this.errorDisplay?.clear();
    } catch (error) {
      this.errorDisplay?.showError(ErrorService.handleError(error as Error));
    }
  }

  private setupEventListeners(): void {
    if (this.providerSelect) {
      this.providerSelect.addEventListener('change', async () => {
        const provider = this.providerSelect?.value as Provider;
        if (provider) {
          this.showProviderConfiguration(provider);
          await this.loadProviderSpecificConfig(provider);
        } else {
          this.hideProviderConfiguration();
        }
      });
    }

    if (this.saveButton) {
      this.saveButton.addEventListener('click', async () => {
        await this.saveConfiguration();
      });
    }

    if (this.modelInput) {
      this.modelInput.addEventListener('focus', () => {
        const provider = this.providerSelect?.value as Provider;
        if (
          provider &&
          this.modelInput &&
          (!this.modelInput.value || this.modelInput.value.trim() === '')
        ) {
          this.modelInput.value = ConfigService.getDefaultModel(provider);
        }
      });
    }
  }

  private async loadProviderSpecificConfig(provider: Provider): Promise<void> {
    try {
      const providerConfig = await ConfigService.loadProviderConfig(provider);

      if (this.apiKeyInput) {
        this.apiKeyInput.value = providerConfig.apiKey;
      }

      if (this.modelInput) {
        this.modelInput.value = providerConfig.model;
      }

      this.errorDisplay?.clear();
    } catch (error) {
      this.errorDisplay?.showError(ErrorService.handleError(error as Error));
    }
  }

  private showProviderConfiguration(provider: Provider): void {
    if (!this.providerConfigSection) return;

    this.providerConfigSection.style.display = 'block';
    this.hideAllConfigSections();

    if (provider === 'openai' || provider === 'anthropic') {
      this.showCloudProviderConfig(provider);
    } else if (provider === 'lmstudio' || provider === 'ollama') {
      this.showLocalProviderConfig(provider);
    }

    if (this.modelSection) {
      this.modelSection.style.display = 'block';
      this.updateModelConfiguration(provider);
    }

    if (this.saveSection) {
      this.saveSection.style.display = 'block';
    }
  }

  private hideProviderConfiguration(): void {
    if (this.providerConfigSection) {
      this.providerConfigSection.style.display = 'none';
    }
    if (this.saveSection) {
      this.saveSection.style.display = 'none';
    }
  }

  private hideAllConfigSections(): void {
    if (this.apiKeySection) this.apiKeySection.style.display = 'none';
    if (this.localInstructionsSection) this.localInstructionsSection.style.display = 'none';
  }

  private showCloudProviderConfig(provider: Provider): void {
    if (!this.apiKeySection) return;

    this.apiKeySection.style.display = 'block';

    const helpElement = DomUtils.getElementById('apiKeyHelp');
    if (helpElement) {
      if (provider === 'openai') {
        helpElement.textContent = 'Get your API key from platform.openai.com';
      } else if (provider === 'anthropic') {
        helpElement.textContent = 'Get your API key from console.anthropic.com';
      }
    }
  }

  private showLocalProviderConfig(provider: Provider): void {
    if (!this.localInstructionsSection) return;

    this.localInstructionsSection.style.display = 'block';

    const instructionElement = DomUtils.getElementById('localInstructionText');
    if (instructionElement) {
      if (provider === 'lmstudio') {
        instructionElement.innerHTML = `
          <strong>🖥️ LM Studio Setup:</strong><br>
          1. Start LM Studio and go to "Local Server" tab<br>
          2. Load a model and click "Start Server"<br>
          3. Ensure server runs on port 1234<br>
          4. Enable CORS if needed
        `;
      } else if (provider === 'ollama') {
        instructionElement.innerHTML = `
          <strong>🐋 Ollama Setup:</strong><br>
          1. Install Ollama and pull a model<br>
          2. Start with: <code>OLLAMA_ORIGINS="*" ollama serve</code><br>
          3. Server will run on port 11434<br>
          4. CORS origins setting is required for Chrome extensions
        `;
      }
    }
  }

  private updateModelConfiguration(provider: Provider): void {
    if (!this.modelInput) return;

    const helpElement = DomUtils.getElementById('modelHelp');
    const defaultModel = ConfigService.getDefaultModel(provider);

    this.modelInput.placeholder = defaultModel;

    if (helpElement) {
      switch (provider) {
        case 'openai':
          helpElement.textContent = 'e.g., gpt-4o-mini, gpt-4o, gpt-3.5-turbo';
          break;
        case 'anthropic':
          helpElement.textContent = 'e.g., claude-3-5-haiku-latest, claude-3-5-sonnet-latest';
          break;
        case 'lmstudio':
          helpElement.textContent = 'Use the exact model name shown in LM Studio';
          break;
        case 'ollama':
          helpElement.textContent = 'e.g., llama3.1:8b, gemma2:9b, codellama:7b';
          break;
        default:
          helpElement.textContent = '';
      }
    }

    if (!this.modelInput.value || this.modelInput.value.trim() === '') {
      this.modelInput.value = defaultModel;
    }
  }

  private async saveConfiguration(): Promise<void> {
    try {
      const provider = this.providerSelect?.value as Provider;
      const apiKey = this.apiKeyInput?.value || '';
      const model = this.modelInput?.value || ConfigService.getDefaultModel(provider);

      if (!provider) {
        this.errorDisplay?.showError('Please select a provider');
        return;
      }

      if ((provider === 'openai' || provider === 'anthropic') && !apiKey.trim()) {
        this.errorDisplay?.showError('API key is required for cloud providers');
        return;
      }

      await ConfigService.saveConfig({
        apiKey,
        provider,
        model,
      });

      if (this.saveButton) {
        const originalText = this.saveButton.textContent;
        this.saveButton.textContent = '✅ Saved!';
        this.saveButton.disabled = true;

        setTimeout(() => {
          if (this.saveButton) {
            this.saveButton.textContent = originalText;
            this.saveButton.disabled = false;
          }
        }, 2000);
      }

      this.errorDisplay?.showSuccess(
        'Configuration saved successfully! Try typing "ask" in the address bar.'
      );
    } catch (error) {
      this.errorDisplay?.showError(ErrorService.handleError(error as Error));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
