/**
 * DOM manipulation utilities
 */
export class DomUtils {
  static getElementById(id: string): HTMLElement | null {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID '${id}' not found`);
    }
    return element;
  }

  static setTextContent(id: string, text: string): void {
    const element = DomUtils.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  }

  static setInnerHTML(id: string, html: string): void {
    const element = DomUtils.getElementById(id);
    if (element) {
      element.innerHTML = html;
    }
  }

  static toggleVisibility(id: string, show: boolean): void {
    const element = DomUtils.getElementById(id);
    if (element) {
      element.style.display = show ? 'block' : 'none';
    }
  }

  static addEventListener(id: string, event: string, handler: EventListener): void {
    const element = DomUtils.getElementById(id);
    if (element) {
      element.addEventListener(event, handler);
    }
  }

  static createElement(
    tag: string,
    parentId: string,
    attributes: Record<string, string> = {},
    textContent: string = ''
  ): HTMLElement | null {
    const parent = DomUtils.getElementById(parentId);
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
