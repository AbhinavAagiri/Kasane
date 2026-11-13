import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { AtlasProvider } from '@/store/AtlasProvider';
import { ToastProvider } from '@/components/ui/Toast';
import '@/styles/globals.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <AtlasProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AtlasProvider>
    </BrowserRouter>
  </StrictMode>,
);
