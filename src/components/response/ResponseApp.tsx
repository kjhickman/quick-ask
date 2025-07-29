import { ErrorDisplay } from '@components/error-display/ErrorDisplay';
import { useStreamingResponse } from '@hooks/useStreamingResponse';
import { UrlUtils } from '@utils/url-utils';
import type React from 'react';
import { useMemo } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { QueryDisplay } from './QueryDisplay';
import { StreamingResponse } from './StreamingResponse';

export function ResponseApp(): React.ReactElement {
  // Get query from URL parameters
  const query = useMemo(() => {
    return UrlUtils.getQueryParam('query');
  }, []);

  const { isLoading, responseText, error, isStreaming, clearError } = useStreamingResponse(query);

  if (!query) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--color-bg-primary)' }}
      >
        <div
          className="rounded-lg p-8 max-w-md w-full text-center"
          style={{
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            No Query Provided
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Please provide a query parameter to get a response.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Query Display */}
        <QueryDisplay query={query} />

        {/* Response Container */}
        <div
          className="rounded-lg p-6"
          style={{
            background: 'var(--color-bg-secondary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Loading State */}
          {isLoading && <LoadingSpinner text="Thinking..." />}

          {/* Error State */}
          {error && (
            <div className="space-y-4">
              <ErrorDisplay error={error} />
              <div className="text-center">
                <button
                  type="button"
                  onClick={clearError}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'var(--color-text-inverse)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--color-primary-hover)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--color-primary)';
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Streaming Response */}
          {(responseText || isStreaming) && !error && (
            <StreamingResponse text={responseText} isStreaming={isStreaming} />
          )}

          {/* Completion State */}
          {responseText && !isStreaming && !error && (
            <div className="mt-4 text-center">
              <div
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium"
                style={{
                  color: '#22c55e',
                  background: 'rgba(34, 197, 94, 0.1)',
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }}></div>
                <span>Complete</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm">
          <p style={{ color: 'var(--color-text-muted)' }}>Powered by QuickAsk</p>
        </div>
      </div>
    </div>
  );
}
