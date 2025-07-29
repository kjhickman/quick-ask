import React from 'react';
import { createRoot } from 'react-dom/client';
import { PopupApp } from '../../components/popup/PopupApp';

// Ensure the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root container not found');
    return;
  }

  const root = createRoot(container);
  root.render(<PopupApp />);
});
