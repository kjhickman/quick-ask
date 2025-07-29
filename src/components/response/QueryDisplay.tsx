import React from 'react';

export interface QueryDisplayProps {
  query: string;
  className?: string;
}

export function QueryDisplay({ query, className = '' }: QueryDisplayProps): React.ReactElement {
  return (
    <div
      className={`rounded-lg p-4 mb-6 ${className}`}
      style={{
        background: 'var(--color-bg-secondary)',
        borderLeft: '4px solid var(--color-primary)',
      }}
    >
      <div className="flex items-start space-x-2">
        <span
          className="font-semibold flex-shrink-0"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Query:
        </span>
        <span className="break-words" style={{ color: 'var(--color-text-primary)' }}>
          {query}
        </span>
      </div>
    </div>
  );
}
