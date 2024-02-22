type Reference = {
  author: string;
  siteName: string;
  title: string;
  lastModified: string;
  lastVisited: string;
  url: string;
  description?: string;
  address?: Address;
  organization?: string;
  note?: string;
  type?: string;
};

type Address = {
  country: string;
  locality: string;
  region: string;
  postalCode: string;
  streetAddress: string;
};
