'use client';

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { Check, X } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

const ThemedToaster = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-center"
      theme={theme === 'system' ? 'system' : theme}
      icons={{
        success: <Check className="w-4 h-4 text-green-500" />,
        error: <X className="w-4 h-4 text-red-500" />,
      }}
    />
  );
};

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemedToaster />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
