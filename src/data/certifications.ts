import type { Certification } from "@/types/content";
import certificationsJson from "../content/certifications.json";

/**
 * Edited in the admin: /keystatic → Certifications (file: src/content/certifications.json).
 * While the list is empty, the section and its navigation link stay hidden.
 */
type CertificationsJson = {
  items: { id?: string; name: string; issuer: string; date: string; credentialId?: string | null; verifyUrl?: string | null }[];
};

export const certifications: Certification[] = (certificationsJson as unknown as CertificationsJson)
  .items.filter((c) => c.name?.trim())
  .map((c, i) => ({
    id: c.id || `certification-${i}`,
    name: c.name,
    issuer: c.issuer,
    date: c.date,
    credentialId: c.credentialId || undefined,
    verifyUrl: c.verifyUrl || undefined,
  }));
