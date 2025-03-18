type Redirect = {
  _id: string;
  fromDomain: string;
  toDomain: string;
  redirectType: RedirectType;
  pathForwarding: boolean;
  queryForwarding: boolean;
  isVerified: boolean;
  userID: string;
  __v: number;
};

type DnsRecord = {
  type: string;
  addresses: string[];
  isRootDomain: boolean;
  isVerified: boolean;
};

type StatusResponse = {
  success: boolean;
  title: string;
  summary: string;
  domainType?: string;
  currentStatus?: string;
  currentAddresses?: string[];
  detail?: string;
  certificateStatus?: 'existing' | 'pending';
};

type Required = {
  recordType: string;
  value: string;
  action: string;
};

type Instruction = {
  step: number;
  description: string;
};

type DomainStatus = {
  dnsRecords: DnsRecord;
  status: StatusResponse;
  required?: Required;
  instructions?: {
    title: string;
    steps: Instruction[];
  };
  support?: {
    contactEmail: string;
    additionalInfo: string;
  };
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

type UserResponse = {
  _id: string;
  email: string;
  isAdmin: boolean;
  __v: number;
};

type RedirectAPIResponse = {
  _id: string;
  fromDomain: string;
  toDomain: string;
  isVerified: boolean;
};
