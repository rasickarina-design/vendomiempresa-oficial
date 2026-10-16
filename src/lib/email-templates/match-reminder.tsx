import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface MatchReminderProps {
  audience?: 'buyer' | 'seller'
  items?: string[]
  siteUrl?: string
}

const SITE_NAME = 'Vendo Mi Empresa'

const MatchReminderEmail = ({
  audience = 'buyer',
  items = [],
  siteUrl = 'https://vendomiempresa.app',
}: MatchReminderProps) => {
  const intro =
    audience === 'buyer'
      ? `Te recordamos que tienes un match pendiente con una empresa publicada en ${SITE_NAME}.`
      : `Te recordamos que tienes un match pendiente con un comprador interesado en ${SITE_NAME}.`

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Recordatorio de match pendiente en {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={stripe} />
          <Heading style={h1}>Recordatorio de match pendiente</Heading>
          <Text style={text}>{intro}</Text>

          {items.length > 0 ? (
            <Section style={card}>
              {items.map((item) => (
                <Text key={item} style={itemText}>
                  •{' '}
                  {item.split(/(https:\/\/\S+)/).map((part, i) =>
                    part.startsWith('https://') ? (
                      <Link key={i} href={part} style={{ color: '#b8860b', textDecoration: 'underline' }}>
                        {part}
                      </Link>
                    ) : (
                      <React.Fragment key={i}>{part}</React.Fragment>
                    ),
                  )}
                </Text>
              ))}
            </Section>
          ) : null}

          <Text style={text}>Entra en la plataforma para ver el detalle y contactar a la contraparte.</Text>
          <Button style={button} href={siteUrl}>
            Ver mis matches
          </Button>

          <Hr style={hr} />
          <Text style={footer}>
            Atención al cliente:{' '}
            <Link href="mailto:contact@makebusinessesflow.com" style={link}>
              contact@makebusinessesflow.com
            </Link>
          </Text>
          <Text style={footer}>Powered by Make Business Flow</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: MatchReminderEmail,
  subject: 'Recordatorio: tienes un match pendiente en Vendo Mi Empresa',
  displayName: 'Recordatorio de match',
  previewData: {
    audience: 'buyer',
    items: ['Panadería industrial · Gastronomía y restauración · EUR 250.000'],
  },
} satisfies TemplateEntry

export default MatchReminderEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = {
  padding: '24px 28px',
  maxWidth: '520px',
  border: '1px solid #eaeaea',
  borderRadius: '10px',
}
const stripe = {
  height: '8px',
  borderRadius: '4px',
  backgroundColor: '#f5c400',
  marginBottom: '20px',
}
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#111111',
  margin: '0 0 16px',
}
const text = {
  fontSize: '15px',
  color: '#3d3d3d',
  lineHeight: '1.5',
  margin: '0 0 18px',
}
const card = {
  backgroundColor: '#fdf8e3',
  border: '1px solid #f5c400',
  borderRadius: '8px',
  padding: '14px 16px',
  margin: '0 0 20px',
}
const itemText = {
  fontSize: '14px',
  color: '#111111',
  lineHeight: '1.5',
  margin: '0 0 6px',
}
const button = {
  backgroundColor: '#111111',
  color: '#f5c400',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const hr = { borderColor: '#eaeaea', margin: '28px 0 12px' }
const link = { color: '#a88a00', textDecoration: 'underline' }
const footer = { fontSize: '12px', color: '#7c7c7c', margin: '6px 0 0' }