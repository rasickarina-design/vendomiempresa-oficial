import { createFileRoute } from '@tanstack/react-router'
import { fmtMoney, isMatch } from '@/lib/marketplace'
import { toBuyer, toCompany } from '@/lib/market-sync.functions'

/** Resumen semanal para la administradora (sábados). Un único destinatario fijo. */
export const Route = createFileRoute('/api/public/hooks/weekly-summary')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env['SUPABASE_PUBLISHABLE_KEY'] || process.env['SUPABASE_ANON_KEY']
        if (!key || request.headers.get('apikey') !== key) {
          return new Response('Unauthorized', { status: 401 })
        }
        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
        const [{ data: cRows }, { data: bRows }] = await Promise.all([
          supabaseAdmin.from('companies').select('*').limit(5000),
          supabaseAdmin.from('buyers').select('*').order('created_at', { ascending: false }).limit(5000),
        ])
        const weekAgo = Date.now() - 7 * 86400000
        const companies = (cRows ?? []).map(toCompany)
        const seen = new Set<string>()
        const buyers = (bRows ?? []).map(toBuyer).filter((b) => {
          const k = b.email.toLowerCase()
          if (seen.has(k)) return false
          seen.add(k)
          return true
        })
        const matches: string[] = []
        for (const c of companies)
          for (const b of buyers)
            if (isMatch(c, b))
              matches.push(
                `${c.name} (${c.owner}) ↔ ${b.name || 'Comprador'} (${b.email}) · ${c.sector} · ${c.country || '—'} · ${fmtMoney(c.priceAmount, c.priceCurrency)}`,
              )
        const now = new Date()
        const day = now.toISOString().slice(0, 10)
        const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
        const res = await sendTemplateEmail('admin-weekly-summary', 'rasickarina@gmail.com', {
          templateData: {
            weekLabel: `semana hasta el ${now.toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' })}`,
            companies: companies.length,
            buyers: buyers.length,
            newCompanies: companies.filter((c) => c.createdAt >= weekAgo).length,
            newBuyers: buyers.filter((b) => b.updatedAt >= weekAgo).length,
            matches: matches.slice(0, 200),
          },
          idempotencyKey: `admin-weekly-summary-${day}`,
        })
        return Response.json({ ok: true, matches: matches.length, sent: res.sent })
      },
    },
  },
})
