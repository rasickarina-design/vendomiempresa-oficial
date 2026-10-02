import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'
import { fmtMoney, isMatch, type Buyer, type Company, type Role } from '@/lib/marketplace'

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toCompany(r: any): Company {
  return {
    id: r.share_ref || r.id,
    name: r.name,
    sector: r.sector,
    location: r.location ?? '—',
    city: r.city ?? '',
    postalCode: r.postal_code ?? '',
    country: r.country ?? '',
    linkedin: r.linkedin ?? '',
    whatsapp: r.whatsapp ?? '',
    googleProfile: r.google_profile ?? '',
    mapsUrl: r.maps_url ?? '',
    financialsUrl: r.financials_url ?? '',
    websiteUrl: r.website_url ?? '',
    age: r.age ?? '—',
    revenue: r.revenue ?? '',
    priceAmount: r.price_amount === null ? null : Number(r.price_amount),
    priceCurrency: r.price_currency,
    desc: r.description,
    owner: r.owner_email,
    ownerName: r.owner_name ?? '',
    ownerPosition: r.owner_position ?? '',
    ownerPhone: r.owner_phone ?? '',
    createdAt: new Date(r.created_at).getTime(),
  }
}

export function toBuyer(r: any): Buyer {
  return {
    email: r.email,
    phone: r.phone ?? '',
    name: r.name ?? '',
    sectors: r.sectors,
    budgetMin: r.budget_min === null ? '' : String(Number(r.budget_min)),
    budgetMax: r.budget_max === null ? '' : String(Number(r.budget_max)),
    currency: r.currency,
    locationPref: r.location_pref ?? '',
    country: r.country ?? '',
    linkedin: r.linkedin ?? '',
    whatsapp: r.whatsapp ?? '',
    position: r.buyer_position ?? '',
    thesis: r.thesis ?? '',
    role: (r.role as Role) ?? 'buyer',
    updatedAt: new Date(r.created_at).getTime(),
  }
}

/**
 * Busca en toda la base los matches del usuario (como vendedor y comprador).
 * Solo devuelve sus propios registros y las contrapartes que hacen match.
 * Con notify=true, avisa por email a ambas partes de cada match nuevo.
 */
export const syncMarketplace = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { notify?: boolean }) => ({ notify: !!input?.notify }))
  .handler(async ({ data, context }) => {
    const email = String((context.claims as { email?: string })?.email ?? '').toLowerCase()
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const [{ data: cRows }, { data: bRows }] = await Promise.all([
      supabaseAdmin.from('companies').select('*').order('created_at', { ascending: false }).limit(2000),
      supabaseAdmin.from('buyers').select('*').order('created_at', { ascending: false }).limit(2000),
    ])

    const companies = (cRows ?? []).map(toCompany)
    // Un perfil por email: el más reciente.
    const seen = new Set<string>()
    const buyers: Buyer[] = []
    for (const r of bRows ?? []) {
      const k = String(r.email).toLowerCase()
      if (seen.has(k)) continue
      seen.add(k)
      buyers.push(toBuyer(r))
    }

    const mine = (e: string) => e.toLowerCase() === email
    const myCompanies = companies.filter((c) => mine(c.owner))
    const myBuyer = buyers.find((b) => mine(b.email))

    const pairs: Array<{ company: Company; buyer: Buyer }> = []
    for (const c of myCompanies) for (const b of buyers) if (!mine(b.email) && isMatch(c, b)) pairs.push({ company: c, buyer: b })
    if (myBuyer) for (const c of companies) if (!mine(c.owner) && isMatch(c, myBuyer)) pairs.push({ company: c, buyer: myBuyer })

    const outCompanies = new Map<string, Company>()
    const outBuyers = new Map<string, Buyer>()
    myCompanies.forEach((c) => outCompanies.set(c.id, c))
    if (myBuyer) outBuyers.set(myBuyer.email, myBuyer)
    for (const p of pairs) {
      outCompanies.set(p.company.id, p.company)
      outBuyers.set(p.buyer.email, p.buyer)
    }

    let sent = 0
    if (data.notify && pairs.length > 0) {
      const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
      for (const { company, buyer } of pairs.slice(0, 30)) {
        const key = `${company.id}-${buyer.email.toLowerCase()}`
        const jobs = [
          sendTemplateEmail('match-notification', company.owner, {
            templateData: {
              audience: 'seller',
              matchCount: 1,
              items: [`${buyer.name || 'Comprador'} busca ${buyer.sectors} · presupuesto ${fmtMoney(buyer.budgetMin, buyer.currency)} – ${fmtMoney(buyer.budgetMax, buyer.currency)}`],
            },
            idempotencyKey: `match-seller-${key}`,
          }),
          sendTemplateEmail('match-notification', buyer.email, {
            templateData: {
              audience: 'buyer',
              matchCount: 1,
              items: [`${company.name} · ${company.sector} · ${fmtMoney(company.priceAmount, company.priceCurrency)}`],
            },
            idempotencyKey: `match-buyer-${key}`,
          }),
        ]
        const results = await Promise.allSettled(jobs)
        results.forEach((r) => {
          if (r.status === 'fulfilled' && r.value.sent) sent++
          if (r.status === 'rejected') console.error('syncMarketplace email', r.reason)
        })
      }
    }

    return {
      companies: Array.from(outCompanies.values()),
      buyers: Array.from(outBuyers.values()),
      matches: pairs.length,
      sent,
    }
  })
