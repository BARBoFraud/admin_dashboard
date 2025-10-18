export type DetailedReport = {
  id: number;
  name?: string;
  lastName?: string;
  description: string;
  url?: string;
  website?: string;
  socialMedia?: string | null;
  phoneNumber?: string | null;
  createdAt: string;
  username?: string | null;
  email?: string | null;
  image?: string | null;
  category: string;
  title: string;
  risk: string;
};
