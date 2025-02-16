import { cookies } from 'next/headers';

import { getUserData } from '@/lib/helpers/getUserData';

import Logo from '../Micro/Logo';

import LoginAvatar from './Avatar/LoginAvatar';

const Navbar: React.FC = async () => {
  const token = (await cookies()).get('token')?.value;
  const { user } = await getUserData(token);
  return (
    <div className="w-full flex h-nav px-4 items-center justify-between border-b border-input">
      <div className="flex items-center justify-center gap-2">
        <Logo className="border border-white" height={50} width={50} />
        <div>
          <h1 className="text-xl font-bold">redirect.</h1>
          <p className="text-sm -mt-1 font-bold">lazyweb.rocks</p>
        </div>
      </div>
      <LoginAvatar user={user || undefined} />
    </div>
  );
};

export default Navbar;
