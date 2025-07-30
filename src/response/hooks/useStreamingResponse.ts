import { ERROR_MESSAGES } from '@shared/config/constants';
import type { ApiConfig } from '@shared/providers/types';
import { createRequestConfig, parseResponseChunk } from '@shared/utils/api';
import { loadConfig } from '@shared/utils/config';
import { ApiError, getErrorMessage, requiresApiKey } from '@shared/utils/error';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface StreamingState {
  isLoading: boolean;
  responseText: string;
  error: string | null;
  isStreaming: boolean;
}

export function useStreamingResponse(query: string | null): StreamingState & {
  startStreaming: () => Promise<void>;
  clearError: () => void;
} {
  const [state, setState] = useState<StreamingState>({
    isLoading: false,
    responseText: '',
    error: null,
    isStreaming: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  const streamResponse = useCallback(async (query: string, config: ApiConfig): Promise<void> => {
    try {
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, 30000);

      const { url, headers, body } = createRequestConfig(query, config);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isStreaming: true,
      }));

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let responseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          let data = '';

          if (line.startsWith('data: ')) {
            data = line.slice(6);
            if (data === '[DONE]') continue;
          } else if (line.trim()?.startsWith('{')) {
            data = line.trim();
          } else {
            continue;
          }

          const content = parseResponseChunk(data, config.provider);

          if (content) {
            responseText += content;
            setState(prev => ({
              ...prev,
              responseText,
            }));
          }
        }
      }

      setState(prev => ({
        ...prev,
        isStreaming: false,
      }));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isStreaming: false,
          error: 'Request timed out',
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isStreaming: false,
          error: getErrorMessage(error, config),
        }));
      }
    }
  }, []);

  const startStreaming = useCallback(async (): Promise<void> => {
    if (!query) {
      setState(prev => ({ ...prev, error: 'No query provided' }));
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        responseText: '',
        isStreaming: false,
      }));

      const config = await loadConfig();

      if (!config.apiKey && requiresApiKey(config.provider)) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: ERROR_MESSAGES.NO_API_KEY,
        }));
        return;
      }

      await streamResponse(query, config);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isStreaming: false,
        error: getErrorMessage(error),
      }));
    }
  }, [query, streamResponse]);

  useEffect(() => {
    return (): void => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (query && !state.isLoading && !state.isStreaming && !state.responseText) {
      startStreaming();
    }
  }, [query, startStreaming, state.isLoading, state.isStreaming, state.responseText]);

  return {
    ...state,
    startStreaming,
    clearError,
  };
}
