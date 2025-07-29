import type React from 'react';
import { useEffect, useRef } from 'react';

export interface StreamingResponseProps {
  text: string;
  isStreaming: boolean;
  className?: string;
}

export function StreamingResponse({
  text,
  isStreaming,
  className = '',
}: StreamingResponseProps): React.ReactElement {
  const responseRef = useRef<HTMLPreElement>(null);

  // Auto-scroll to bottom as content streams in
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, []);

  if (!text) {
    return (
      <div className={`text-center py-8 ${className}`} style={{ color: 'var(--color-text-muted)' }}>
        Waiting for response...
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <pre
        ref={responseRef}
        className="rounded-lg p-4 whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto"
        style={{
          background: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border-secondary)',
          color: 'var(--color-text-primary)',
        }}
      >
        {text}
        {isStreaming && (
          <span
            className="inline-block w-2 h-5 animate-pulse ml-1 align-text-bottom"
            style={{
              background: 'var(--color-primary)',
            }}
          >
            |
          </span>
        )}
      </pre>

      {isStreaming && (
        <div className="absolute top-2 right-2">
          <div
            className="flex items-center space-x-2 px-2 py-1 rounded-md text-xs font-medium"
            style={{
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--color-primary)' }}
            ></div>
            <span>Streaming...</span>
          </div>
        </div>
      )}
    </div>
  );
}
