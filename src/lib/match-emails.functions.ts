import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export interface NotifyMatchInput {
  audience: 'buyer' | 'seller'
  matchCount: number
  items: string[]
  /** Identificador estable del evento que disparó el aviso (evita duplicados). */
  eventRef: string
}

/**
 * Avisa por email al usuario autenticado de que tiene nuevos matches.
 * El destinatario siempre es el propio usuario de la sesión — nunca se acepta
 * una dirección arbitraria desde el navegador.
 */
export const notifyMatch = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: NotifyMatchInput) => input)
  .handler(async ({ data, context }) => {
    const email = (context.claims as { email?: string } | undefined)?.email
    if (!email) return { sent: false as const }

    const count = Math.max(1, Math.min(50, Math.floor(data.matchCount)))
    const items = (data.items ?? []).slice(0, 5).map((i) => String(i).slice(0, 160))

    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
    try {
      const result = await sendTemplateEmail('match-notification', email, {
        templateData: {
          audience: data.audience === 'seller' ? 'seller' : 'buyer',
          matchCount: count,
          items,
        },
        idempotencyKey: `match-notification-${data.eventRef}`,
      })
      return { sent: result.sent }
    } catch (error) {
      console.error('notifyMatch', error)
      return { sent: false as const }
    }
  })
