import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site-footer";

const TITLE = "Normas de Privacidad — PALFRAN LLC | Vendomiempresa";
const DESCRIPTION =
  "Normas de privacidad, política de cookies y disclaimer legal de PALFRAN LLC, propietaria de Make Businesses Flow y de Vendomiempresa.";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://vendomiempresa.com/privacidad" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://vendomiempresa.com/privacidad" }],
  }),
  component: PrivacidadPage,
});

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id}>
      <h2 className="mb-3 text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PrivacidadPage() {
  const updated = "20 de junio de 2026";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card/95 px-5 py-4 backdrop-blur">
        <Link to="/" className="text-[15px] font-bold tracking-tight text-primary">
          Vendomiempresa
        </Link>
        <Link to="/" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-primary">
          ← Volver al inicio
        </Link>
      </nav>

      <main className="mx-auto w-full max-w-3xl px-5 py-14">
        <header className="mb-10 border-b border-border pb-7">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Legal</p>
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Normas de Privacidad</h1>
          <p className="text-sm text-muted-foreground">
            Empresa responsable: <strong className="text-foreground">PALFRAN LLC</strong> · Última
            actualización: {updated}
          </p>
        </header>

        <article className="space-y-10">
          <section className="surface-card rounded-[16px] border-l-4 border-l-primary p-6">
            <h2 className="mb-3 text-lg font-bold uppercase tracking-tight text-primary">
              Disclaimer sobre los servicios
            </h2>
            <div className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                El contenido publicado en esta plataforma (artículos, videos, guías, posts, recursos
                descargables y cualquier material de carácter educativo o informativo) es propiedad de{" "}
                <strong className="text-foreground">PALFRAN LLC</strong> y se ofrece con fines
                exclusivamente informativos y educativos.
              </p>
              <p className="text-foreground">
                <strong>
                  PALFRAN LLC no se responsabiliza por decisiones financieras, contables, fiscales,
                  operativas o estratégicas tomadas por usuarios, lectores o empresas con base en el
                  contenido publicado en este sitio sin haber realizado previamente una consulta
                  personalizada con nuestro equipo.
                </strong>
              </p>
              <p>
                Cada negocio tiene un contexto, estructura y realidad financiera única. La información
                general publicada en el sitio no constituye asesoramiento financiero, legal, contable ni
                de inversión, y no reemplaza el análisis individualizado que se brinda dentro de una
                consultoría, mentoría o sesión de diagnóstico contratada con PALFRAN LLC. Si vas a tomar
                decisiones que impactan tu empresa, agendá una consulta con nosotros antes de actuar.
              </p>
            </div>
          </section>

          <Section title="1. Identificación de la empresa">
            <p>
              Esta plataforma y la marca <strong className="text-foreground">Make Businesses Flow</strong>{" "}
              son operadas y son propiedad de <strong className="text-foreground">PALFRAN LLC</strong>{" "}
              ("PALFRAN", "nosotros", "nuestro" o "la Empresa"). Estas normas explican cómo tratamos la
              información de quienes visitan el sitio o contratan nuestros servicios.
            </p>
          </Section>

          <Section title="2. Información que recogemos">
            <p>PALFRAN LLC puede recoger los siguientes datos:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Datos de contacto:</strong> nombre, correo
                electrónico, teléfono y empresa cuando rellenas un formulario o reservas una sesión.
              </li>
              <li>
                <strong className="text-foreground">Datos de navegación:</strong> dirección IP, tipo de
                navegador, páginas visitadas y tiempo de permanencia, mediante cookies y herramientas de
                analítica.
              </li>
              <li>
                <strong className="text-foreground">Datos de calendario y reservas:</strong> información
                que compartís al reservar una llamada a través de Calendly u otras plataformas de agenda.
              </li>
              <li>
                <strong className="text-foreground">Datos comerciales:</strong> información necesaria para
                emitir facturas, ejecutar servicios contratados y cumplir con obligaciones legales o
                fiscales.
              </li>
            </ul>
          </Section>

          <Section title="3. Cómo usamos tu información">
            <ul className="list-disc space-y-2 pl-6">
              <li>Responder consultas y coordinar sesiones, mentorías o servicios.</li>
              <li>
                Enviar información comercial relacionada con nuestros servicios (solo con tu
                consentimiento).
              </li>
              <li>Mejorar el contenido, la experiencia y la seguridad del sitio.</li>
              <li>Cumplir con obligaciones contractuales, fiscales y legales.</li>
            </ul>
          </Section>

          <Section title="4. Compartir información con terceros">
            <p>
              PALFRAN LLC no vende ni alquila datos personales. Podemos compartir información con
              proveedores que nos ayudan a operar (hosting, analítica, email marketing, agenda y
              procesamiento de pagos). Estos proveedores solo acceden a los datos necesarios para prestar
              su servicio y están obligados a tratarlos de forma confidencial.
            </p>
          </Section>

          <Section id="cookies" title="5. Política de Cookies">
            <p>
              Este sitio utiliza <strong className="text-foreground">cookies</strong> y tecnologías
              similares (pixeles, local storage, identificadores de sesión) para garantizar el correcto
              funcionamiento del sitio, recordar tus preferencias, analizar el tráfico y mejorar la
              experiencia de navegación.
            </p>
            <h3 className="pt-3 text-base font-bold uppercase tracking-tight text-foreground">
              ¿Qué es una cookie?
            </h3>
            <p>
              Una cookie es un pequeño archivo de texto que un sitio web guarda en tu navegador cuando lo
              visitás. Permite que el sitio recuerde información sobre tu visita, como tu idioma preferido
              u otras opciones.
            </p>
            <h3 className="pt-3 text-base font-bold uppercase tracking-tight text-foreground">
              Tipos de cookies que utilizamos
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Cookies estrictamente necesarias:</strong>{" "}
                imprescindibles para el funcionamiento del sitio (navegación, seguridad, acceso a áreas
                protegidas). No requieren consentimiento.
              </li>
              <li>
                <strong className="text-foreground">Cookies de rendimiento y analítica:</strong> nos
                permiten conocer cómo los visitantes interactúan con el sitio para mejorar su
                funcionamiento (por ejemplo, Google Analytics).
              </li>
              <li>
                <strong className="text-foreground">Cookies de funcionalidad:</strong> recuerdan tus
                preferencias (idioma, región) para personalizar la experiencia.
              </li>
              <li>
                <strong className="text-foreground">Cookies de terceros:</strong> establecidas por
                servicios integrados como Calendly, LinkedIn, Instagram o procesadores de pago. Cada
                proveedor gestiona sus propias cookies según su política.
              </li>
            </ul>
            <h3 className="pt-3 text-base font-bold uppercase tracking-tight text-foreground">
              Cómo gestionar o desactivar las cookies
            </h3>
            <p>
              Podés aceptar, rechazar o eliminar las cookies en cualquier momento desde la configuración
              de tu navegador:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p>Desactivar ciertas cookies puede afectar el funcionamiento de algunas secciones del sitio.</p>
            <h3 className="pt-3 text-base font-bold uppercase tracking-tight text-foreground">
              Consentimiento
            </h3>
            <p>
              Al continuar navegando en este sitio aceptás el uso de cookies de acuerdo con esta política.
              Podés retirar tu consentimiento en cualquier momento eliminando las cookies desde tu
              navegador o escribiéndonos a{" "}
              <a href="mailto:contact@makebusinessesflow.com" className="text-primary hover:underline">
                contact@makebusinessesflow.com
              </a>
              .
            </p>
          </Section>

          <Section title="6. Retención de datos">
            <p>
              Conservamos tu información personal solo durante el tiempo necesario para los fines
              descritos en estas normas o el que exijan las leyes aplicables. Cuando ya no sea necesaria,
              será eliminada o anonimizada.
            </p>
          </Section>

          <Section title="7. Seguridad">
            <p>
              PALFRAN LLC aplica medidas técnicas y organizativas razonables para proteger tus datos
              contra accesos no autorizados, pérdida o alteración. Sin embargo, ningún sistema en internet
              es 100% seguro.
            </p>
          </Section>

          <Section title="8. Tus derechos">
            <p>Como usuario tienes derecho a:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Acceder a los datos personales que tenemos sobre ti.</li>
              <li>Solicitar la rectificación o eliminación de tus datos.</li>
              <li>Oponerte o limitar el tratamiento de tu información.</li>
              <li>Retirar tu consentimiento en cualquier momento.</li>
              <li>Presentar una reclamación ante la autoridad de protección de datos correspondiente.</li>
            </ul>
            <p>
              Para ejercer estos derechos escríbenos a{" "}
              <a href="mailto:contact@makebusinessesflow.com" className="text-primary hover:underline">
                contact@makebusinessesflow.com
              </a>
              .
            </p>
          </Section>

          <Section title="9. Limitación de responsabilidad">
            <p>
              PALFRAN LLC pone su mejor esfuerzo en mantener la información del sitio actualizada y
              precisa, pero no garantiza la exactitud, integridad ni vigencia del contenido en todo
              momento. El uso de la información publicada es bajo exclusiva responsabilidad del usuario.
            </p>
            <p>
              PALFRAN LLC no será responsable por daños directos, indirectos, incidentales o consecuentes
              derivados del uso o imposibilidad de uso del sitio, ni por decisiones tomadas con base en su
              contenido sin una consulta personalizada previa con nuestro equipo.
            </p>
          </Section>

          <Section title="10. Enlaces a terceros">
            <p>
              Este sitio puede incluir enlaces a sitios externos (LinkedIn, Calendly, Linktree, entre
              otros). PALFRAN LLC no es responsable de las prácticas de privacidad ni del contenido de
              esos sitios. Te recomendamos revisar sus políticas antes de proporcionar información
              personal.
            </p>
          </Section>

          <Section title="11. Cambios en estas normas">
            <p>
              PALFRAN LLC puede actualizar estas normas ocasionalmente. La versión vigente estará siempre
              disponible en esta página, con la fecha de última actualización.
            </p>
          </Section>

          <Section title="12. Contacto">
            <p>
              Para preguntas sobre estas normas o sobre el tratamiento de tus datos, escríbenos a{" "}
              <a href="mailto:contact@makebusinessesflow.com" className="text-primary hover:underline">
                contact@makebusinessesflow.com
              </a>
              .
            </p>
          </Section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
