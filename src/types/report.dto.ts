export interface ReportDto {
  id: number;
  description: string | null;
  url?: string | null;
  website?: string | null;
  socialMedia?: string | null;
  phoneNumber?: string | null;
  createdAt: string | null;
  username: string | null;
  email?: string | null;
  image?: string | null;
  category: string | null;
}
