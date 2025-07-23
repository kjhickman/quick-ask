/**
 * URL manipulation utilities
 */
export class UrlUtils {
  /**
   * Get a query parameter from the current URL
   * @param param - The parameter name
   * @returns The parameter value or null if not found
   */
  static getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  /**
   * Create a response page URL with query parameter
   * @param query - The search query
   * @returns The complete URL
   */
  static createResponseUrl(query: string): string {
    return chrome.runtime.getURL('src/html/response.html') + '?query=' + encodeURIComponent(query);
  }
  
  /**
   * Decode URL parameters safely
   * @param encodedString - The encoded string
   * @returns The decoded string
   */
  static safeDecodeURIComponent(encodedString: string): string {
    try {
      return decodeURIComponent(encodedString);
    } catch (e) {
      console.warn('Failed to decode URI component:', encodedString);
      return encodedString;
    }
  }
  
  /**
   * Validate if a URL is valid
   * @param url - The URL to validate
   * @returns True if valid, false otherwise
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
