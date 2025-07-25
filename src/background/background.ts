/**
 * Background script for QuickAsk
 * Handles omnibox interactions
 */
chrome.omnibox.onInputEntered.addListener(
  (text: string, disposition: chrome.omnibox.OnInputEnteredDisposition) => {
    const url =
      chrome.runtime.getURL('src/pages/response/response.html') +
      '?query=' +
      encodeURIComponent(text);

    if (disposition === 'currentTab') {
      chrome.tabs.update({ url: url });
    } else {
      chrome.tabs.create({ url: url });
    }
  }
);

chrome.omnibox.onInputChanged.addListener(
  (text: string, suggest: (suggestResults: chrome.omnibox.SuggestResult[]) => void) => {
    suggest([
      {
        content: text,
        description: `QuickAsk: ${text}`,
      },
    ]);
  }
);
