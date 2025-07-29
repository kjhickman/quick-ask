import React from 'react';

export interface LoadingSpinnerProps {
  text?: string;
  show?: boolean;
  className?: string;
}

export function LoadingSpinner({
  text = 'Thinking...',
  show = true,
  className = '',
}: LoadingSpinnerProps): React.ReactElement | null {
  if (!show) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 py-8 ${className}`}>
      {/* Animated spinner */}
      <div className="relative">
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{
            borderColor: 'var(--color-border-light)',
            borderTopColor: 'var(--color-primary)',
          }}
        ></div>
      </div>

      {/* Loading text */}
      <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        {text}
      </div>
    </div>
  );
}
