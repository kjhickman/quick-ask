import type React from 'react';

export interface ErrorDisplayProps {
  error?: string | null;
  success?: string | null;
  warning?: string | null;
  className?: string;
}

export function ErrorDisplay({
  error,
  success,
  warning,
  className = '',
}: ErrorDisplayProps): React.ReactElement | null {
  const message = error || success || warning;

  if (!message) {
    return null;
  }

  let typeClass = '';
  if (error) typeClass = 'error';
  else if (success) typeClass = 'success';
  else if (warning) typeClass = 'warning';

  return <div className={`error-display ${typeClass} ${className}`}>{message}</div>;
}
