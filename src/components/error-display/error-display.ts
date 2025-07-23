/**
 * Reusable error display component
 */
export class ErrorDisplay {
  private element: HTMLElement | null;

  /**
   * @param element - The element or element ID
   */
  constructor(element: HTMLElement | string) {
    this.element = typeof element === 'string' 
      ? document.getElementById(element) 
      : element;
    
    if (!this.element) {
      console.warn('ErrorDisplay: Element not found');
      return;
    }
    
    this.hide();
  }
  
  /**
   * Show error message
   * @param error - The error to display
   */
  showError(error: string | Error): void {
    if (!this.element) return;
    
    const message = typeof error === 'string' ? error : error.message;
    this.element.textContent = message;
    this.element.className = 'error-display error';
    this.element.style.display = 'block';
  }
  
  /**
   * Show success message
   * @param message - The success message
   */
  showSuccess(message: string): void {
    if (!this.element) return;
    
    this.element.textContent = message;
    this.element.className = 'error-display success';
    this.element.style.display = 'block';
  }
  
  /**
   * Show warning message
   * @param message - The warning message
   */
  showWarning(message: string): void {
    if (!this.element) return;
    
    this.element.textContent = message;
    this.element.className = 'error-display warning';
    this.element.style.display = 'block';
  }
  
  /**
   * Hide the error display
   */
  hide(): void {
    if (this.element) {
      this.element.style.display = 'none';
      this.element.textContent = '';
    }
  }
  
  /**
   * Clear and hide the error display
   */
  clear(): void {
    this.hide();
  }
  
  /**
   * Create an error display element
   * @param parentId - Parent element ID
   * @param className - Additional CSS class
   * @returns The error display instance
   */
  static create(parentId: string, className: string = ''): ErrorDisplay | null {
    const parent = document.getElementById(parentId);
    if (!parent) {
      console.warn('ErrorDisplay.create: Parent element not found');
      return null;
    }
    
    const errorContainer = document.createElement('div');
    errorContainer.className = `error-display ${className}`;
    errorContainer.style.display = 'none';
    
    parent.appendChild(errorContainer);
    return new ErrorDisplay(errorContainer);
  }
}
