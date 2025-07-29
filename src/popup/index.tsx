import { createRoot } from 'react-dom/client';
import { PopupApp } from './components/PopupApp';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root container not found');
    return;
  }

  const root = createRoot(container);
  root.render(<PopupApp />);
});
