/**
 * URL manipulation utilities
 */
export class UrlUtils {
  static getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  static createResponseUrl(query: string): string {
    return `${chrome.runtime.getURL('src/html/response.html')}?query=${encodeURIComponent(query)}`;
  }

  static safeDecodeURIComponent(encodedString: string): string {
    try {
      return decodeURIComponent(encodedString);
    } catch {
      console.warn('Failed to decode URI component:', encodedString);
      return encodedString;
    }
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
