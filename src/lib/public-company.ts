import { supabase } from "@/integrations/supabase/client";
import type { Company } from "./marketplace";

export interface PublicCompany {
  share_ref: string;
  name: string;
  sector: string;
  city: string | null;
  country: string | null;
  age: string | null;
  revenue: string | null;
  price_amount: number | null;
  price_currency: string | null;
  description: string;
  maps_url: string | null;
  owner_position: string | null;
}

/** Public, non-sensitive listing lookup by shareable reference. */
export async function fetchPublicCompany(ref: string): Promise<PublicCompany | null> {
  const client = supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: PublicCompany[] | null; error: unknown }>;
  };
  const { data, error } = await client.rpc("get_public_company", { _ref: ref });
  if (error || !data || data.length === 0) return null;
  return data[0];
}

/** Build a Company-shaped record from the public preview (contact fields stay empty). */
export function toCompany(p: PublicCompany): Company {
  return {
    id: p.share_ref,
    name: p.name,
    sector: p.sector,
    location: "",
    city: p.city ?? "",
    postalCode: "",
    country: p.country ?? "",
    linkedin: "",
    googleProfile: "",
    mapsUrl: p.maps_url ?? "",
    financialsUrl: "",
    age: p.age ?? "",
    revenue: p.revenue ?? "",
    priceAmount: p.price_amount,
    priceCurrency: p.price_currency ?? "USD",
    desc: p.description,
    owner: "",
    ownerName: "",
    ownerPosition: p.owner_position ?? "",
    ownerPhone: "",
    createdAt: Date.now(),
  };
}

export function shareUrl(ref: string) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/empresa/${ref}`;
}
