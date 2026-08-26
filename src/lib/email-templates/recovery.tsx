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

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Restablece tu contraseña de {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={stripe} />
        <Heading style={h1}>Restablece tu contraseña</Heading>
        <Text style={text}>
          Hemos recibido una solicitud para restablecer la contraseña de tu
          cuenta en {siteName}. Pulsa el botón para elegir una nueva.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Restablecer contraseña
        </Button>
        <Text style={footer}>
          Si no has solicitado este cambio, puedes ignorar este correo: tu
          contraseña no se modificará.
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

export default RecoveryEmail

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
