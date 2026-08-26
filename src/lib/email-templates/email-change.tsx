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

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail es la dirección actual del usuario (HookData.OldEmail).
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Confirma el cambio de email en {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={stripe} />
        <Heading style={h1}>Confirma el cambio de email</Heading>
        <Text style={text}>
          Has solicitado cambiar tu dirección de email en {siteName} de{' '}
          <Link href={`mailto:${oldEmail}`} style={link}>
            {oldEmail}
          </Link>{' '}
          a{' '}
          <Link href={`mailto:${newEmail}`} style={link}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={text}>Pulsa el botón para confirmar el cambio:</Text>
        <Button style={button} href={confirmationUrl}>
          Confirmar cambio de email
        </Button>
        <Text style={footer}>
          Si no has solicitado este cambio, protege tu cuenta cuanto antes.
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

export default EmailChangeEmail

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
const link = { color: '#f5c400', textDecoration: 'underline' }
const button = {
  backgroundColor: '#f5c400',
  color: '#000000',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#7c7c7c', margin: '28px 0 0' }
