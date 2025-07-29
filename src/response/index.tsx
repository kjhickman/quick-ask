import { createRoot } from 'react-dom/client';
import { ResponseApp } from './components/ResponseApp';

// Ensure the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root container not found');
    return;
  }

  const root = createRoot(container);
  root.render(<ResponseApp />);
});
