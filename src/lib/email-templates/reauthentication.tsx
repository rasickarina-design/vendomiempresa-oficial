import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ReauthenticationEmailProps {
  siteName: string
  token: string
}

export const ReauthenticationEmail = ({
  siteName,
  token,
}: ReauthenticationEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu código de verificación de {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={stripe} />
        <Heading style={h1}>Confirma tu identidad en {siteName}</Heading>
        <Text style={text}>
          Introduce este código de 6 dígitos para confirmar tu identidad en{' '}
          {siteName}:
        </Text>
        <Section style={codeBox}>
          <Text style={code}>{token}</Text>
        </Section>
        <Text style={footer}>
          El código caduca en unos minutos. Si no has solicitado esta
          verificación, puedes ignorar este correo.
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

export default ReauthenticationEmail

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
const footer = { fontSize: '12px', color: '#7c7c7c', margin: '28px 0 0' }
