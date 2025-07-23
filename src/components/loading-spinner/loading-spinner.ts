/**
 * Reusable loading spinner component
 */
export class LoadingSpinner {
  private element: HTMLElement | null;
  private originalDisplay: string = 'block';

  /**
   * @param element - The element or element ID
   */
  constructor(element: HTMLElement | string) {
    this.element = typeof element === 'string' ? document.getElementById(element) : element;

    if (!this.element) {
      console.warn('LoadingSpinner: Element not found');
      return;
    }

    this.originalDisplay = this.element.style.display || 'block';
    this.hide();
  }

  /**
   * Show the loading spinner
   */
  show(): void {
    if (this.element) {
      this.element.style.display = 'flex';
    }
  }

  /**
   * Hide the loading spinner
   */
  hide(): void {
    if (this.element) {
      this.element.style.display = 'none';
    }
  }

  /**
   * Toggle spinner visibility
   * @param show - Whether to show or hide
   */
  toggle(show: boolean): void {
    if (show) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Set loading text
   * @param text - The loading text
   */
  setText(text: string): void {
    if (this.element) {
      const textElement = this.element.querySelector('.loading-text');
      if (textElement) {
        textElement.textContent = text;
      }
    }
  }

  /**
   * Create a loading spinner element
   * @param parentId - Parent element ID
   * @param text - Loading text
   * @returns The spinner instance
   */
  static create(parentId: string, text: string = 'Loading...'): LoadingSpinner | null {
    const parent = document.getElementById(parentId);
    if (!parent) {
      console.warn('LoadingSpinner.create: Parent element not found');
      return null;
    }

    const spinnerContainer = document.createElement('div');
    spinnerContainer.className = 'loading-spinner';
    spinnerContainer.innerHTML = `
      <div class="spinner-icon"></div>
      <div class="loading-text">${text}</div>
    `;

    parent.appendChild(spinnerContainer);
    return new LoadingSpinner(spinnerContainer);
  }
}
