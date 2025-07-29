import React, { useState } from 'react';

export interface SaveButtonProps {
  onSave: () => Promise<boolean>;
  disabled?: boolean;
  className?: string;
}

export function SaveButton({
  onSave,
  disabled = false,
  className = '',
}: SaveButtonProps): React.ReactElement {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (): Promise<void> => {
    if (saving || disabled) return;

    setSaving(true);
    setSaved(false);

    try {
      const success = await onSave();

      if (success) {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
        }, 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const getButtonText = (): string => {
    if (saving) return 'Saving...';
    if (saved) return '✅ Saved!';
    return 'Save Configuration';
  };

  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={handleSave}
      disabled={disabled || saving || saved}
    >
      {getButtonText()}
    </button>
  );
}
