import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';

import { ThemeProvider } from '@/components/ThemeProvider';
import { LOGOUT_ENDPOINT } from '@/lib/constants';
import axiosClientServer from '@/lib/helpers/axios/server';
import { Toaster } from '@/lib/toast';

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
  const { data, error } = await axiosClientServer.get<UserResponse>('/api/auth/me');

  if (error) {
    const BASE_URL = (await headers()).get('host');
    const PROTOCOL = (await headers()).get('x-forwarded-proto');
    const LOGOUT_URL = `${PROTOCOL}://${BASE_URL}${LOGOUT_ENDPOINT}`;
    await fetch(LOGOUT_URL, { method: 'GET' });
  }

  const userDetails = {
    email: data?.email,
    id: data?._id,
  };

  const encodedUserDetails = JSON.stringify(userDetails);
  const encodedUserDetailsBase64 = Buffer.from(encodedUserDetails).toString('base64');

  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} dark ${geistMono.variable} antialiased`}
        data-body={encodedUserDetailsBase64}
      >
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
