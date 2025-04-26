'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { LanguageProvider } from '@/lib/LanguageContext';

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <Notifications />
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </MantineProvider>
  );
} 