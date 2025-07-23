/**
 * DOM manipulation utilities
 */
export class DomUtils {
  /**
   * Safely get element by ID
   * @param id - The element ID
   * @returns The element or null if not found
   */
  static getElementById(id: string): HTMLElement | null {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID '${id}' not found`);
    }
    return element;
  }

  /**
   * Set element text content safely
   * @param id - The element ID
   * @param text - The text to set
   */
  static setTextContent(id: string, text: string): void {
    const element = this.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  }

  /**
   * Set element HTML content safely
   * @param id - The element ID
   * @param html - The HTML to set
   */
  static setInnerHTML(id: string, html: string): void {
    const element = this.getElementById(id);
    if (element) {
      element.innerHTML = html;
    }
  }

  /**
   * Toggle element visibility
   * @param id - The element ID
   * @param show - Whether to show or hide
   */
  static toggleVisibility(id: string, show: boolean): void {
    const element = this.getElementById(id);
    if (element) {
      element.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * Add event listener safely
   * @param id - The element ID
   * @param event - The event type
   * @param handler - The event handler
   */
  static addEventListener(id: string, event: string, handler: EventListener): void {
    const element = this.getElementById(id);
    if (element) {
      element.addEventListener(event, handler);
    }
  }

  /**
   * Create and append element
   * @param tag - The HTML tag
   * @param parentId - The parent element ID
   * @param attributes - Attributes to set
   * @param textContent - Text content
   * @returns The created element
   */
  static createElement(
    tag: string,
    parentId: string,
    attributes: Record<string, string> = {},
    textContent: string = ''
  ): HTMLElement | null {
    const parent = this.getElementById(parentId);
    if (!parent) return null;

    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    if (textContent) {
      element.textContent = textContent;
    }

    parent.appendChild(element);
    return element;
  }
}
