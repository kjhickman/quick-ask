export function getElementById(id: string): HTMLElement | null {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID '${id}' not found`);
  }
  return element;
}

export function setTextContent(id: string, text: string): void {
  const element = getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

export function setInnerHTML(id: string, html: string): void {
  const element = getElementById(id);
  if (element) {
    element.innerHTML = html;
  }
}

export function toggleVisibility(id: string, show: boolean): void {
  const element = getElementById(id);
  if (element) {
    element.style.display = show ? 'block' : 'none';
  }
}

export function addEventListener(id: string, event: string, handler: EventListener): void {
  const element = getElementById(id);
  if (element) {
    element.addEventListener(event, handler);
  }
}

export function createElement(
  tag: string,
  parentId: string,
  attributes: Record<string, string> = {},
  textContent: string = ''
): HTMLElement | null {
  const parent = getElementById(parentId);
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
