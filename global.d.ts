type Redirect = {
  _id: string;
  fromDomain: string;
  toDomain: string;
  redirectType: 'permanent' | 'temporary';
  pathForwarding: boolean;
  queryForwarding: boolean;
  isVerified: boolean;
  userID: string;
  __v: number;
};

type RedirectResponse = {
  redirects: Redirect[];
};

type User = {
  email: string;
  expirationDate: string;
  isAdmin: boolean;
  id: string;
  iat: number;
};
