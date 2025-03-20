'use client';

import { useEffect } from 'react';

import { GhostIcon } from 'lucide-react';

import CreateRedirect from '@/components/Micro/CreateRedirect';
import LottiePlayer from '@/components/Micro/LottiePlayer';
import LoginAvatar from '@/components/Navbar/Avatar/LoginAvatar';
import RedirectsTable from '@/components/RedirectsTable';
import useIsLoggedIn from '@/lib/hooks/useIsLogedIn';
import useRedirectStore from '@/lib/zustand';

type Props = {
  redirectsServer: Redirect[];
};

const Screen = ({ redirectsServer }: Props) => {
  const { redirects, setRedirects } = useRedirectStore();
  const { isLoggedIn } = useIsLoggedIn();

  useEffect(() => {
    if (redirectsServer) {
      setRedirects(redirectsServer);
    }
  }, [redirectsServer, setRedirects]);

  if (!redirects || redirects.length === 0 || !isLoggedIn) {
    return (
      <div className="h-main flex flex-col items-center justify-center">
        <LottiePlayer
          autoplay
          loop
          className="-mt-[10vh]"
          height={200}
          speed={1}
          src="/no-data.lottie"
          width={200}
        />
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold">
            {isLoggedIn ? 'No Redirects Found' : 'Sign in to get started'}
          </h2>
          <p className="text-gray-400 mb-4 mt-2">
            {isLoggedIn
              ? 'Create a new redirect to get started'
              : 'Login to view and manage your redirects'}
          </p>
          {isLoggedIn && <CreateRedirect />}
          {!isLoggedIn && (
            <LoginAvatar>
              <div className="bg-primary text-background gap-2 flex items-center justify-center whitespace-nowrap border border-border font-bold rounded-lg px-4 p-2">
                <GhostIcon className="w-4 h-4" fontWeight={500} />
                Login
              </div>
            </LoginAvatar>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-main p-4 md:p-8">
      <div className="w-full flex items-center justify-between">
        <h1 className="md:text-2xl text-xl font-bold">Redirects</h1>
        <div className="flex justify-end gap-4">
          <CreateRedirect />
        </div>
      </div>
      <div className="w-full mt-8">
        <RedirectsTable
          redirects={
            redirects && redirects.length > 0
              ? redirects
              : redirectsServer.length > 0
                ? redirectsServer
                : []
          }
        />
      </div>
    </div>
  );
};

export default Screen;
