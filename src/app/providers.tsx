import { ThemeProvider } from 'next-themes';

import { Toaster } from '@/components/ui/sonner';

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      {children}
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
