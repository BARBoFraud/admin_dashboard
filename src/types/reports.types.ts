export interface ShortPendingReport {
    id: number;
    name?: string;
    lastName?: string;
    url?: string;
    website?: string;
    socialMedia?: string | null;
    phoneNumber?: string | null;
    createdAt: string;
    username?: string | null;
    email?: string | null;
    category: string;
}