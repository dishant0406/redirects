'use client';

import { useState } from 'react';

import Cookies from 'js-cookie';
import { GithubIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { isValidEmail } from '@/lib/helpers';
import { useGithubOAuth } from '@/lib/hooks/useGithubAuth';

import AvatarWithToolTip from '.';

const LoginAvatar: React.FC<{
  user?: User;
}> = ({ user }) => {
  const [email, setEmail] = useState('');
  const { initiateOAuth } = useGithubOAuth({
    clientUrl: `${process.env.NEXT_PUBLIC_LAZYWEB_BACKEND_URL}/oauth/github`,
    onSuccess: (token) => {
      Cookies.set('token', token);
      window.location.reload();
    },
    onError: (error) => {
      console.error('OAuth failed:', error);
    },
  });

  if (user) {
    return (
      <Popover>
        <PopoverTrigger>
          <AvatarWithToolTip user={user} />
        </PopoverTrigger>
        <PopoverContent className="w-80" sideOffset={5}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Logout</h4>
              <p className="text-sm text-muted-foreground">Logout from your account.</p>
            </div>
            <div className="grid gap-2">
              <div className="w-full flex items-center gap-4">
                <Button
                  className="w-full"
                  tooltip="Logout"
                  tooltipDirection="bottom"
                  variant="secondary"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger>
        <AvatarWithToolTip />
      </PopoverTrigger>
      <PopoverContent className="w-80" sideOffset={5}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Login</h4>
            <p className="text-sm text-muted-foreground">
              Login to access your dashboard and manage your redirects.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-4 items-center ">
              <Label htmlFor="width">Email</Label>
              <Input
                className="col-span-3 h-8"
                id="email"
                placeholder="admin@lazyweb.rocks"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-full flex items-center gap-4 mt-4">
              <Button
                className="w-full"
                disabled={!isValidEmail(email)}
                tooltip="Login using magic link"
                tooltipDirection="bottom"
              >
                Magic Login
              </Button>
              <Button
                className="w-full"
                tooltip="Login using Github"
                tooltipDirection="bottom"
                variant="secondary"
                onClick={initiateOAuth}
              >
                <GithubIcon className="w-4 h-4" />
                Github
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LoginAvatar;
