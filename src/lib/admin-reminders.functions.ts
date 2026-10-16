import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'
import { fmtMoney, isMatch } from '@/lib/marketplace'
import { toBuyer, toCompany } from '@/lib/market-sync.functions'

type ReminderSide = 'buyer' | 'seller'

export const sendMatchReminder = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { companyRef: string; buyerEmail: string; recipientSide: ReminderSide }) => ({
    companyRef: String(input?.companyRef ?? '').trim(),
    buyerEmail: String(input?.buyerEmail ?? '').trim().toLowerCase(),
    recipientSide: input?.recipientSide === 'seller' ? 'seller' : 'buyer',
  }))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc('has_role', {
      _user_id: context.userId,
      _role: 'admin',
    })
    if (!isAdmin) throw new Error('Sin permisos')
    if (!data.companyRef || !data.buyerEmail) throw new Error('Faltan datos del match')

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const companyQuery = supabaseAdmin.from('companies').select('*')
    const companyPromise = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      data.companyRef,
    )
      ? companyQuery.eq('id', data.companyRef).limit(1)
      : companyQuery.eq('share_ref', data.companyRef).limit(1)
    const [{ data: companyRows, error: companyError }, { data: buyerRows, error: buyerError }] = await Promise.all([
      companyPromise,
      supabaseAdmin
        .from('buyers')
        .select('*')
        .ilike('email', data.buyerEmail)
        .order('created_at', { ascending: false })
        .limit(1),
    ])

    if (companyError) throw new Error(companyError.message)
    if (buyerError) throw new Error(buyerError.message)
    const companyRow = companyRows?.[0]
    const buyerRow = buyerRows?.[0]
    if (!companyRow || !buyerRow) throw new Error('No encontré ese match')

    const company = toCompany(companyRow)
    const buyer = toBuyer(buyerRow)
    if (!isMatch(company, buyer)) throw new Error('Ese cruce ya no es un match')

    const recipient = data.recipientSide === 'seller' ? company.owner : buyer.email
    const matchKey = `${company.id}-${buyer.email.toLowerCase()}`
    const reminderId = crypto.randomUUID()
    const idempotencyKey = `match-reminder-${data.recipientSide}-${matchKey}-${reminderId}`
    const items =
      data.recipientSide === 'seller'
        ? [
            `${buyer.name || 'Comprador'}${buyer.position ? ` (${buyer.position})` : ''} busca ${buyer.sectors} · presupuesto ${fmtMoney(buyer.budgetMin, buyer.currency)} – ${fmtMoney(buyer.budgetMax, buyer.currency)}`,
            `Contacto: ${buyer.email}${buyer.phone ? ` · Tel. ${buyer.phone}` : ''}${buyer.whatsapp ? ` · WhatsApp ${buyer.whatsapp}` : ''}`,
            `Ubicación buscada: ${[buyer.locationPref, buyer.country].filter(Boolean).join(', ') || '—'}`,
          ]
        : [
            `${company.name} · ${company.sector} · ${fmtMoney(company.priceAmount, company.priceCurrency)}`,
            `Contacto: ${company.ownerName || 'Vendedor'}${company.ownerPosition ? ` (${company.ownerPosition})` : ''} · ${company.owner}${company.ownerPhone ? ` · Tel. ${company.ownerPhone}` : ''}${company.whatsapp ? ` · WhatsApp ${company.whatsapp}` : ''}`,
            `Ubicación: ${[company.location !== '—' ? company.location : '', company.city, company.postalCode, company.country].filter(Boolean).join(', ') || '—'}`,
            ...(company.mapsUrl ? [`Google Maps: ${company.mapsUrl}`] : []),
          ]

    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
    let sent = false
    let reason: string | null = null
    try {
      const result = await sendTemplateEmail('match-reminder', recipient, {
        templateData: { audience: data.recipientSide, items },
        idempotencyKey,
      })
      sent = result.sent
      reason = result.sent ? null : result.reason
    } catch (error) {
      reason = String(error instanceof Error ? error.message : error).slice(0, 500)
      throw error
    } finally {
      const { error: logError } = await supabaseAdmin.from('match_email_notifications').insert({
        match_key: matchKey,
        company_ref: company.id,
        company_name: company.name,
        buyer_email: buyer.email,
        seller_email: company.owner,
        recipient_email: recipient,
        recipient_side: data.recipientSide,
        template_name: 'match-reminder',
        idempotency_key: idempotencyKey,
        sent,
        reason,
      })
      if (logError) console.error('sendMatchReminder email log', logError.message)
    }

    return { sent, recipient, reason }
  })