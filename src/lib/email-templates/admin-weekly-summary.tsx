import * as React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  weekLabel?: string
  companies?: number
  buyers?: number
  newCompanies?: number
  newBuyers?: number
  matches?: string[]
}

const AdminWeeklySummaryEmail = ({
  weekLabel = 'esta semana',
  companies = 0,
  buyers = 0,
  newCompanies = 0,
  newBuyers = 0,
  matches = [],
}: Props) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Resumen semanal de Vendo Mi Empresa: {String(matches.length)} matches</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={stripe} />
        <Heading style={h1}>Resumen semanal</Heading>
        <Text style={text}>Movimiento de Vendo Mi Empresa ({weekLabel}).</Text>
        <Section style={card}>
          <Text style={itemText}>Empresas en venta: {companies} (nuevas en 7 días: {newCompanies})</Text>
          <Text style={itemText}>Compradores: {buyers} (nuevos en 7 días: {newBuyers})</Text>
          <Text style={itemText}>Matches activos: {matches.length}</Text>
        </Section>
        {matches.length > 0 ? (
          <Section style={card}>
            {matches.map((m) => (
              <Text key={m} style={itemText}>• {m}</Text>
            ))}
          </Section>
        ) : (
          <Text style={text}>No hay matches por ahora.</Text>
        )}
        <Hr style={hr} />
        <Text style={footer}>Powered by Make Business Flow</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminWeeklySummaryEmail,
  subject: 'Resumen semanal de matches — Vendo Mi Empresa',
  displayName: 'Resumen semanal (administración)',
  to: 'rasickarina@gmail.com',
  previewData: { weekLabel: 'semana del 3 de octubre', companies: 3, buyers: 3, newCompanies: 1, newBuyers: 2, matches: ['PALFRAN LLC (vendedor a@x.com) ↔ Juan (b@y.com) · USD 1.000.000'] },
} satisfies TemplateEntry

export default AdminWeeklySummaryEmail

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
