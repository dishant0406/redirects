import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';

import { ThemeProvider } from '@/components/ThemeProvider';
import axiosClientServer from '@/lib/helpers/axios/server';

import type { Metadata } from 'next';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Domain Redirecting Service hassle-free - redirect.lazyweb.rocks',
  description:
    "Get peace of mind when redirecting your domains without the burden of hosting them. We are a domain redirect service with full HTTPS support and API compatibility. Enter your domain names and we'll take care of the rest.",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { data, error } = await axiosClientServer.get<User>('/api/auth/me');

  if (error) {
    const BASE_URL = (await headers()).get('host');
    const PROTOCOL = (await headers()).get('x-forwarded-proto');
    const LOGOUT_ENDPOINT = '/api/auth/logout';
    const LOGOUT_URL = `${PROTOCOL}://${BASE_URL}${LOGOUT_ENDPOINT}`;
    await fetch(LOGOUT_URL, { method: 'GET' });
  }

  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} dark ${geistMono.variable} antialiased`}
        data-user-email={data?.email}
      >
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
