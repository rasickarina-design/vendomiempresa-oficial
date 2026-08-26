export type Role = "seller" | "buyer" | "both";

export const RUBROS = [
  "Gastronomía y restauración",
  "Farmacias y salud",
  "E-commerce y negocios digitales",
  "Hostelería y turismo",
  "Retail y comercio minorista",
  "Construcción y reformas",
  "Industria y manufactura",
  "Logística y transporte",
  "Educación y formación",
  "Belleza y bienestar",
  "Tecnología y software",
  "Marketing y agencias digitales",
  "Automoción",
  "Inmobiliario",
  "Servicios profesionales",
  "Limpieza e higiene",
  "Agroindustria y alimentación",
  "Energía y sostenibilidad",
  "Entretenimiento y ocio",
  "Franquicias",
  "Otro",
] as const;

export type Rubro = (typeof RUBROS)[number];

export interface Company {
  id: string;
  name: string;
  sector: string;
  location: string;
  city: string;
  postalCode: string;
  country: string;
  linkedin: string;
  googleProfile: string;
  mapsUrl: string;
  financialsUrl: string;
  age: string;


  revenue: string;
  priceAmount: number | null;
  priceCurrency: string;
  desc: string;
  owner: string;
  ownerName: string;
  ownerPosition: string;
  ownerPhone: string;

  createdAt: number;
}

export interface Buyer {
  email: string;
  phone: string;
  name: string;
  sectors: string;
  budgetMin: string;
  budgetMax: string;
  currency: string;
  locationPref: string;
  country: string;
  linkedin: string;
  thesis: string;
  role: Role;
  updatedAt: number;
}

export interface ContactLog {
  key: string;
  at: number;
}

export const KEY_COMPANIES = "companies-list";
export const KEY_BUYERS = "buyers-list";
export const KEY_CONTACTS = "contacts-log";

export function loadList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function saveList<T>(key: string, list: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* ignore quota errors */
  }
}

export function validEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function validPhone(v: string) {
  return /^[0-9+\s()-]{8,18}$/.test(v);
}

export function maskEmail(e: string) {
  const [u, d] = e.split("@");
  if (!d) return e;
  return u.slice(0, 2) + "*".repeat(Math.max(u.length - 2, 1)) + "@" + d;
}

export function fmtMoney(amount: number | string | null | undefined, currency: string) {
  if (!amount) return "A convenir";
  return currency + " " + Number(amount).toLocaleString("es-AR");
}

function sectorList(s: string) {
  return (s || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

function sectorMatches(companySector: string, buyerSectors: string) {
  const cs = (companySector || "").trim().toLowerCase();
  if (!cs) return false;
  const list = sectorList(buyerSectors);
  if (list.length === 0) return false;
  return list.some((s) => cs.includes(s) || s.includes(cs));
}

function budgetMatches(company: Company, buyer: Buyer) {
  if (!company.priceAmount || buyer.budgetMin === "" || buyer.budgetMax === "") return true;
  if (company.priceCurrency !== buyer.currency) return true;
  const p = Number(company.priceAmount);
  return p >= Number(buyer.budgetMin) && p <= Number(buyer.budgetMax);
}

export function isMatch(company: Company, buyer: Buyer) {
  if (company.owner === buyer.email) return false;
  return sectorMatches(company.sector, buyer.sectors) && budgetMatches(company, buyer);
}

export interface NearMatchResult {
  /** Empresa más aproximada por debajo del presupuesto mínimo. */
  below: Company | null;
  /** Empresa más aproximada por encima del presupuesto máximo. */
  above: Company | null;
  /** Empresas del mismo sector, aunque el precio no encaje. */
  sectorCount: number;
  /** true cuando la diferencia de precio es demasiado grande. */
  tooFar: boolean;
}

/** Aproximaciones por encima y por debajo del presupuesto, dentro del mismo sector. */
export function findNearMatches(companies: Company[], buyer: Buyer): NearMatchResult {
  const sameSector = companies.filter(
    (c) => c.owner !== buyer.email && sectorMatches(c.sector, buyer.sectors),
  );
  const min = Number(buyer.budgetMin);
  const max = Number(buyer.budgetMax);
  const hasBudget = buyer.budgetMin !== "" && buyer.budgetMax !== "" && max > 0;

  const priced = sameSector.filter(
    (c) => !!c.priceAmount && (!hasBudget || c.priceCurrency === buyer.currency),
  );

  let below: Company | null = null;
  let above: Company | null = null;

  if (hasBudget) {
    for (const c of priced) {
      const p = Number(c.priceAmount);
      if (p < min && (!below || Number(below.priceAmount) < p)) below = c;
      if (p > max && (!above || Number(above.priceAmount) > p)) above = c;
    }
  }

  const gaps: number[] = [];
  if (below) gaps.push((min - Number(below.priceAmount)) / min);
  if (above) gaps.push((Number(above.priceAmount) - max) / max);
  const closest = gaps.length ? Math.min(...gaps) : Infinity;

  // Más de un 50% de desvío se considera demasiado alejado del parámetro pedido.
  const tooFar = !below && !above ? sameSector.length > 0 : closest > 0.5;

  return {
    below: tooFar ? null : below,
    above: tooFar ? null : above,
    sectorCount: sameSector.length,
    tooFar,
  };
}

export const SUPPORT_EMAIL = "contact@makebusinessesflow.com";

export function contactKey(buyerEmail: string, companyId: string) {
  return buyerEmail + "::" + companyId;
}

export function mailtoLink(to: string, subject: string, body: string) {
  return (
    "mailto:" +
    encodeURIComponent(to) +
    "?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body)
  );
}

export const PAISES_PRIORITARIOS = [
  "España",
  "Estados Unidos",
  "México",
  "Argentina",
  "Colombia",
  "Chile",
  "Perú",
] as const;

export const PAISES_RESTO = [
  "Alemania",
  "Andorra",
  "Bolivia",
  "Brasil",
  "Canadá",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "Francia",
  "Guatemala",
  "Honduras",
  "Italia",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Portugal",
  "Puerto Rico",
  "Reino Unido",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
  "Otro",
] as const;

export const PAISES = [...PAISES_PRIORITARIOS, ...PAISES_RESTO] as const;

export type Pais = (typeof PAISES)[number];
