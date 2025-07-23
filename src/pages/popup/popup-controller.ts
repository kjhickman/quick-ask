import ConfigService from '../../services/config-service.js';
import { ErrorService } from '../../services/error-service.js';
import { ErrorDisplay } from '../../components/error-display/error-display.js';
import { DomUtils } from '../../utils/dom-utils.js';

/**
 * Popup controller for managing extension configuration
 */
class PopupController {
  private apiKeyInput: HTMLInputElement | null;
  private providerSelect: HTMLSelectElement | null;
  private modelInput: HTMLInputElement | null;
  private saveButton: HTMLButtonElement | null;
  private errorDisplay: ErrorDisplay;

  constructor() {
    this.apiKeyInput = DomUtils.getElementById('apiKey') as HTMLInputElement;
    this.providerSelect = DomUtils.getElementById('provider') as HTMLSelectElement;
    this.modelInput = DomUtils.getElementById('model') as HTMLInputElement;
    this.saveButton = DomUtils.getElementById('save') as HTMLButtonElement;
    this.errorDisplay = new ErrorDisplay('error');
    this.init();
  }

  async init(): Promise<void> {
    try {
      const config = await ConfigService.loadConfig();
      
      if (config.apiKey && this.apiKeyInput) this.apiKeyInput.value = config.apiKey;
      if (config.provider && this.providerSelect) this.providerSelect.value = config.provider;
      if (config.model && this.modelInput) this.modelInput.value = config.model;

      this.setupEventListeners();
      this.errorDisplay?.clear();
    } catch (error) {
      this.errorDisplay?.showError(ErrorService.handleError(error as Error));
    }
  }

  private setupEventListeners(): void {
    if (this.providerSelect) {
      this.providerSelect.addEventListener('change', () => {
        if (this.providerSelect && this.modelInput) {
          const provider = this.providerSelect.value as any;
          this.modelInput.value = ConfigService.getDefaultModel(provider);
        }
      });
    }

    if (this.saveButton) {
      this.saveButton.addEventListener('click', async () => {
        try {
          await ConfigService.saveConfig({
            apiKey: this.apiKeyInput?.value || '',
            provider: (this.providerSelect?.value as any) || 'openai',
            model: this.modelInput?.value || 'gpt-4o-mini'
          });
          
          if (this.saveButton) {
            this.saveButton.textContent = 'Saved!';
          }
          this.errorDisplay?.showSuccess('Configuration saved successfully');
          
          setTimeout(() => {
            if (this.saveButton) {
              this.saveButton.textContent = 'Save Configuration';
            }
            this.errorDisplay?.hide();
          }, 2000);
        } catch (error) {
          this.errorDisplay?.showError(ErrorService.handleError(error as Error));
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
