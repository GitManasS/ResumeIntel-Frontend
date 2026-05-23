import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import App from './app/App';
import { SocketProvider } from './sockets/SocketProvider';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 1 },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SocketProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  '!rounded-xl !border !border-slate-200/80 !bg-white/95 !text-slate-900 !shadow-card !backdrop-blur dark:!border-slate-700 dark:!bg-slate-900/95 dark:!text-white',
                duration: 4000,
              }}
            />
          </SocketProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
