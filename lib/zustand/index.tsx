import { create } from 'zustand';

import { getUserRedirects } from '../api';

interface RedirectState {
  redirects: Redirect[];
  setRedirects: (redirects: Redirect[]) => void;
  fetchRedirects: () => Promise<void>;
}

const useRedirectStore = create<RedirectState>((set) => ({
  redirects: [],
  setRedirects: (redirects) => set({ redirects }),
  fetchRedirects: async () => {
    const { data } = await getUserRedirects();
    const redirects = data.redirects;
    set({ redirects });
  },
}));

export default useRedirectStore;
