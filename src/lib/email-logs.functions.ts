import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export type EmailStatusByRecipient = Record<
  string,
  {
    sent: boolean
    lastSentAt: string
    lastStatus: string
  }
>

export const getEmailStatuses = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc('has_role', {
      _user_id: context.userId,
      _role: 'admin',
    })
    if (!isAdmin) return {} satisfies EmailStatusByRecipient

    const apiKey = process.env['LOVABLE_API_KEY']
    if (!apiKey) return {} satisfies EmailStatusByRecipient

    const { listEmailLogs } = await import('@lovable.dev/email-js')
    const statuses: EmailStatusByRecipient = {}
    const logs = await listEmailLogs({ event_type: 'sent', limit: 100 }, { apiKey })
    for (const event of logs.data) {
      const email = event.recipient.toLowerCase()
      if (statuses[email]) continue
      statuses[email] = {
        sent: true,
        lastSentAt: event.timestamp,
        lastStatus: event.status ?? event.event_type,
      }
    }
    return statuses
  })