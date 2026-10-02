import { supabase } from "@/integrations/supabase/client";
import type { Buyer, Company } from "./marketplace";

/** Empty links become null; links without protocol get https://. */
function link(v?: string | null) {
  const t = (v ?? "").trim();
  if (!t) return null;
  return /^https:\/\//i.test(t) ? t : "https://" + t.replace(/^http:\/\//i, "");
}

/** Mirror app activity into the internal (admin-only) database. */

async function currentUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/** Link the verified email + phone to the real auth user (auth.uid()). */
export async function saveProfile(params: { email: string; phone: string; name?: string }) {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return;
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email ?? params.email,
    phone: params.phone || null,
    name: params.name || null,
  });
  if (error) console.error("saveProfile", error.message);
}

export async function recordCompany(c: Company) {
  const userId = await currentUserId();
  const { error } = await supabase.from("companies").insert({
    user_id: userId,
    share_ref: c.id,
    name: c.name,
    sector: c.sector,
    location: c.location,
    city: c.city,
    postal_code: c.postalCode,
    country: c.country,
    linkedin: link(c.linkedin),
    whatsapp: link(c.whatsapp),
    google_profile: link(c.googleProfile),
    maps_url: link(c.mapsUrl),
    financials_url: link(c.financialsUrl),
    website_url: link(c.websiteUrl),
    owner_position: c.ownerPosition,



    age: c.age,
    revenue: c.revenue,
    price_amount: c.priceAmount,
    price_currency: c.priceCurrency,
    description: c.desc,
    owner_name: c.ownerName,
    owner_email: c.owner,
    owner_phone: c.ownerPhone,
  } as never);
  if (error) console.error("recordCompany", error.message);
}

export async function recordBuyer(b: Buyer) {
  const userId = await currentUserId();
  const { error } = await supabase.from("buyers").insert({
    user_id: userId,
    name: b.name,
    email: b.email,
    phone: b.phone,
    sectors: b.sectors,
    budget_min: b.budgetMin === "" ? null : Number(b.budgetMin),
    budget_max: b.budgetMax === "" ? null : Number(b.budgetMax),
    currency: b.currency,
    location_pref: b.locationPref,
    country: b.country,
    linkedin: link(b.linkedin),
    whatsapp: link(b.whatsapp),
    buyer_position: b.position || "Dueño / Empresario",
    thesis: b.thesis,
    role: b.role,
  });
  if (error) console.error("recordBuyer", error.message);
}

export async function recordContact(params: {
  buyerEmail: string;
  companyName: string;
  companyRef: string;
  direction: "buyer_to_seller" | "seller_to_buyer";
}) {
  const { error } = await supabase.from("contacts").insert({
    buyer_email: params.buyerEmail,
    company_name: params.companyName,
    company_ref: params.companyRef,
    direction: params.direction,
  });
  if (error) console.error("recordContact", error.message);
}

export function toCsv(rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  // BOM so Excel opens accents correctly.
  triggerDownload(
    new Blob(["\uFEFF" + toCsv(rows)], { type: "text/csv;charset=utf-8;" }),
    filename,
  );
}

export async function downloadXlsx(filename: string, rows: Array<Record<string, unknown>>) {
  const XLSX = await import("xlsx");
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Datos");
  const out = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  triggerDownload(
    new Blob([out], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename,
  );
}
