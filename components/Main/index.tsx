import axiosClientServer from '@/lib/helpers/axios/server';

import Screen from './Screen';

const Main: React.FC = async () => {
  const response = await axiosClientServer.get<{ redirects: Redirect[] | null }>(
    '/redirects/get-redirects/me'
  );

  const data = response.data ?? { redirects: [] };

  const redirects = data?.redirects ?? [];

  return <Screen redirectsServer={redirects} />;
};

export default Main;
