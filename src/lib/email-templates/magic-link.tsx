import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
  token?: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
  token,
}: MagicLinkEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu código de acceso a {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={stripe} />
        <Heading style={h1}>Tu código de acceso</Heading>
        <Text style={text}>
          Introduce este código de 8 dígitos en {siteName} para entrar. Caduca
          en unos minutos.
        </Text>
        {token ? (
          <Section style={codeBox}>
            <Text style={code}>{token}</Text>
          </Section>
        ) : null}
        <Text style={text}>O accede directamente con este botón:</Text>
        <Button style={button} href={confirmationUrl}>
          Entrar en {siteName}
        </Button>
        <Text style={footer}>
          Si no has solicitado este acceso, puedes ignorar este correo.
        </Text>
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

export default MagicLinkEmail

const main = { backgroundColor: '#0b0b0b', fontFamily: 'Arial, sans-serif' }
const container = {
  padding: '24px 28px',
  backgroundColor: '#111111',
  borderRadius: '10px',
  maxWidth: '520px',
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
  color: '#ffffff',
  margin: '0 0 16px',
}
const text = {
  fontSize: '15px',
  color: '#c9c9c9',
  lineHeight: '1.5',
  margin: '0 0 18px',
}
const codeBox = {
  backgroundColor: '#000000',
  border: '2px solid #f5c400',
  borderRadius: '8px',
  padding: '14px',
  textAlign: 'center' as const,
  margin: '0 0 22px',
}
const code = {
  fontSize: '32px',
  letterSpacing: '10px',
  fontWeight: 'bold' as const,
  color: '#f5c400',
  margin: '0',
}
const button = {
  backgroundColor: '#f5c400',
  color: '#000000',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const link = { color: '#f5c400', textDecoration: 'underline' }
const footer = { fontSize: '12px', color: '#7c7c7c', margin: '28px 0 0' }
