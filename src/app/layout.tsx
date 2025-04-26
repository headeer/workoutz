import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import { Inter } from 'next/font/google';
import { Container } from '@mantine/core';
import { Navigation } from '../components/Navigation';
import { ClientProvider } from '../components/ClientProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Training Plan App',
  description: 'Your personal workout tracking app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <ClientProvider>
          <Container size="lg" py="xl">
            <Navigation />
            {children}
          </Container>
        </ClientProvider>
      </body>
    </html>
  );
} 