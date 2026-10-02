import { useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  EyeOff,
  Factory,
  Filter,
  KeyRound,
  Menu,
  MessagesSquare,
  Search,
  UserX,
  type LucideIcon,
} from "lucide-react";
import logoAsset from "@/assets/logo.jpg.asset.json";
import { HazardStripe } from "@/components/hazard-stripe";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Role } from "@/lib/marketplace";

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Tiene algún costo usar la plataforma?",
    a: "Publicar tu empresa, definir tu criterio de búsqueda y recibir matches no tiene costo, y el contacto entre las partes es directo: no cobramos comisión sobre la operación entre las partes.",
  },
  {
    q: "¿Se muestran mis datos de contacto a cualquiera?",
    a: "No. Mientras no haya match, tus datos de contacto no se muestran a ningún otro usuario. Cuando la coincidencia se produce, se comparten con esa contraparte concreta para que puedan hablar directamente, sin intermediarios ni comisiones de intermediación.",
  },
  {
    q: "¿Publicar mi empresa es público?",
    a: "Publicas los datos del negocio —sector, facturación, ubicación, precio solicitado— para que el sistema pueda cruzarlos con las búsquedas activas. Tu identidad y tus datos de contacto quedan reservados hasta que exista un match, así puedes explorar el mercado sin exponer que estás vendiendo.",
  },
  {
    q: "¿Qué es exactamente un match?",
    a: "Un match es una coincidencia entre las dos partes. Cuando una empresa publicada encaja con el criterio de búsqueda que definió un comprador —sector, rango de precio y ubicación— el sistema lo detecta y avisa a ambos. No es una recomendación aproximada: es una coincidencia concreta entre lo que se ofrece y lo que se busca.",
  },
  {
    q: "¿Cómo me avisan si hay un match?",
    a: "Cuando tu empresa coincide con un comprador, o tu búsqueda como comprador coincide con una empresa en venta, recibirás un email en la dirección que usaste para entrar. En ese email verás un resumen de la contraparte y un enlace para acceder al match dentro de la plataforma. Desde ahí podrás ver los datos de contacto compartidos y escribir directamente.",
  },
  {
    q: "¿Por qué solo puedo contactar cuando hay match?",
    a: "Para que nadie pierda el tiempo. Si cualquiera pudiera escribir a cualquiera, los vendedores recibirían decenas de consultas de curiosos y los compradores mensajes de empresas que no tienen nada que ver con lo que buscan. Habilitando el contacto solo entre partes compatibles, toda conversación empieza con interés real por ambos lados.",
  },
  {
    q: "¿Qué tipo de empresas se pueden publicar?",
    a: "Se pueden publicar empresas de cualquier sector, incluidas las de tecnología y software que ya tengan una plataforma construida y estén monetizando. Si tu negocio factura, tiene usuarios o clientes de pago y un modelo de ingresos probado, encaja en la categoría Tecnología y software y puede aparecer en las búsquedas de compradores interesados en activos digitales.",
  },
  {
    q: "¿Puedo comprar y vender al mismo tiempo?",
    a: "Sí. Al crear tu cuenta puedes elegir el rol de vendedor, comprador o ambos. Si eliges ambos, publicas tu empresa y defines tu criterio de búsqueda en el mismo perfil, y recibes los matches de las dos partes por separado.",
  },
  {
    q: "¿Cómo preparo y comparto los balances de mi empresa?",
    a: "Reúne los balances y la cuenta de resultados de los tres últimos ejercicios cerrados en PDF (o Excel), súbelos a una carpeta de Google Drive y pega en la publicación el enlace de esa carpeta. Configura el enlace como «Cualquier persona con el enlace puede ver» y no incluyas datos personales de empleados ni clientes. El enlace solo se comparte con la contraparte cuando existe un match.",
  },
  {
    q: "¿En qué me puede ayudar la plataforma?",
    a: "Además de conectar compradores y vendedores, podemos ayudarte a armar una carpeta de presentación de tu empresa para el comprador, analizar los números del negocio si estás del lado comprador, y ponerte en contacto con bancos internacionales y family desks que puedan acompañar la operación.",
  },
  {
    q: "Si soy un banco o family desk, ¿cómo obtengo el listado de empresas en venta?",
    a: "Si eres un banco o family desk interesado en nuestra base de datos, puedes escribirnos a contact@makebusinessesflow.com o suscribirte como comprador y buscar tu match dentro de la plataforma.",
  },
  {
    q: "¿Cómo funciona el acceso con código?",
    a: "No usas contraseña. Ingresas tu correo en la pantalla de acceso y te enviamos un código numérico de un solo uso. Lo copias en la aplicación y entras. El código vence a los 5 minutos y solo sirve una vez, así que nadie puede reutilizarlo. Si vence, pides uno nuevo desde la misma pantalla.",
  },
  {
    q: "¿Necesito crear una contraseña?",
    a: "No. El acceso es siempre con el código que llega a tu correo, así no hay contraseñas que recordar, ni que reciclar, ni que se puedan filtrar. Cada vez que quieras entrar desde un dispositivo nuevo, repites el mismo paso de 30 segundos.",
  },
  {
    q: "¿Qué pasa si no me llega el código?",
    a: "Primero revisa las carpetas de spam y promociones, y comprueba que el correo esté bien escrito (sin espacios ni letras de más). Si tu correo es corporativo, puede haber un filtro interno retrasándolo un minuto. Puedes volver a solicitar el código desde la pantalla de acceso todas las veces que necesites: siempre es válido el último que hayas recibido.",
  },
];

/* ───────────────────────── Datos de las secciones ───────────────────────── */

const NAV = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#seguridad", label: "Privacidad" },
  { href: "#preguntas", label: "Preguntas" },
];

const PROBLEMS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: MessagesSquare,
    title: "Anuncios sueltos",
    text: "Empresas ofrecidas en grupos de WhatsApp y redes sociales, sin datos comparables.",
  },
  {
    icon: UserX,
    title: "Intermediarios informales",
    text: "Contactos personales y comisiones poco claras entre quien vende y quien compra.",
  },
  {
    icon: Filter,
    title: "Imposible filtrar",
    text: "El comprador no puede buscar por sector, presupuesto ni ubicación.",
  },
];

const SELLER_STEPS = [
  {
    title: "Entras con tu correo",
    text: "Te enviamos un código de un solo uso. Sin contraseñas que crear ni recordar.",
  },
  {
    title: "Publicas tu empresa",
    text: "Sector, ubicación, antigüedad, facturación, precio y motivo de venta. Tu identidad y tu contacto quedan reservados.",
  },
  {
    title: "Recibes compradores filtrados",
    text: "Cuando un comprador encaja por sector y presupuesto, les avisamos a ambos y pueden hablar directamente.",
  },
];

const BUYER_STEPS = [
  {
    title: "Entras con tu correo",
    text: "Te enviamos un código de un solo uso. Sin contraseñas que crear ni recordar.",
  },
  {
    title: "Defines qué buscas",
    text: "Sectores de interés, presupuesto y ubicación preferida. Lo defines una sola vez.",
  },
  {
    title: "Te avisamos cuando hay match",
    text: "Solo recibes empresas que encajan con tu criterio, y contactas al vendedor con un clic.",
  },
];

const TRUST: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: EyeOff,
    title: "Tus datos, reservados",
    text: "Tu identidad y tu contacto solo se muestran a la contraparte cuando hay un match real.",
  },
  {
    icon: BadgeDollarSign,
    title: "Sin comisión sobre la operación",
    text: "Publicar, buscar y recibir matches no tiene costo. El contacto entre las partes es directo.",
  },
  {
    icon: KeyRound,
    title: "Acceso sin contraseña",
    text: "Código de un solo uso enviado a tu correo, válido durante 5 minutos.",
  },
];

/* ───────────────────────── Piezas ───────────────────────── */

function SiteHeader({ onLogin }: { onLogin: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-[880px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-5">
        <a
          href="#inicio"
          className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-primary"
        >
          <img src={logoAsset.url} alt="" className="h-9 w-9 shrink-0 rounded-md object-contain" />
          <span className="hero-stencil whitespace-nowrap text-[17px] uppercase text-primary max-sm:text-[13px]">
            Vendo Mi Empresa
          </span>
        </a>

        <nav aria-label="Secciones" className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[14px] font-medium text-muted-foreground transition hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <button onClick={onLogin} className="btn-ghost px-3 text-foreground">
            Ingresar
          </button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="btn-ghost px-2.5 md:hidden" aria-label="Abrir menú">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px] border-border bg-card">
              <SheetTitle className="hero-stencil mb-6 uppercase text-primary">Menú</SheetTitle>
              <nav className="flex flex-col gap-5" aria-label="Secciones">
                {NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="text-[16px] font-medium text-foreground"
                  >
                    {n.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <HazardStripe />
    </header>
  );
}

/** Las dos "puertas" del hero: son el CTA principal y la firma visual de la portada. */
function RoleDoors({
  onStart,
  compact = false,
}: {
  onStart: (role: Role) => void;
  compact?: boolean;
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        onClick={() => onStart("seller")}
        className={`group relative flex flex-col items-start rounded-2xl bg-primary text-left text-primary-foreground transition hover:opacity-95 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary active:scale-[0.995] ${compact ? "p-5" : "p-6 sm:p-7"}`}
      >
        <Factory size={compact ? 26 : 32} strokeWidth={2} aria-hidden />
        <span
          className={`hero-stencil mt-4 uppercase ${compact ? "text-[24px]" : "text-[30px] sm:text-[36px]"}`}
        >
          Vendo
        </span>
        <span className="mt-2 max-w-[34ch] text-[15px] leading-snug font-medium">
          Publica tu empresa gratis. Tus datos quedan reservados hasta que haya match.
        </span>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[15px] font-bold">
          Publicar mi empresa
          <ArrowRight size={18} className="transition group-hover:translate-x-1" aria-hidden />
        </span>
      </button>

      <button
        onClick={() => onStart("buyer")}
        className={`group relative flex flex-col items-start rounded-2xl border-2 border-primary bg-card text-left text-foreground transition hover:bg-card-hover focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary active:scale-[0.995] ${compact ? "p-5" : "p-6 sm:p-7"}`}
      >
        <Search size={compact ? 26 : 32} strokeWidth={2} className="text-primary" aria-hidden />
        <span
          className={`hero-stencil mt-4 uppercase text-primary ${compact ? "text-[24px]" : "text-[30px] sm:text-[36px]"}`}
        >
          Compro
        </span>
        <span className="mt-2 max-w-[34ch] text-[15px] leading-snug text-muted-foreground">
          Define sector, presupuesto y ubicación. Te avisamos cuando aparece una empresa que encaja.
        </span>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[15px] font-bold text-primary">
          Definir mi búsqueda
          <ArrowRight size={18} className="transition group-hover:translate-x-1" aria-hidden />
        </span>
      </button>
    </div>
  );
}

function SectionTitle({
  id,
  children,
  intro,
}: {
  id?: string;
  children: React.ReactNode;
  intro?: string;
}) {
  return (
    <div className="mb-8">
      <h2
        id={id}
        className="text-[30px] font-bold leading-tight text-foreground max-[560px]:text-[24px]"
      >
        {children}
      </h2>
      {intro && (
        <p className="mt-3 max-w-[60ch] text-[16px] leading-[1.7] text-muted-foreground">{intro}</p>
      )}
    </div>
  );
}

function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title} className="card-hairline px-5 pb-6 pt-5">
          <span className="hero-stencil block text-[44px] text-primary" aria-hidden>
            {i + 1}
          </span>
          <h3 className="mt-2 text-[17px] font-bold text-foreground">{s.title}</h3>
          <p className="mt-2 text-[15px] leading-[1.65] text-muted-foreground">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

function BalancesGuide() {
  return (
    <Accordion type="single" collapsible className="mt-6">
      <AccordionItem value="balances" className="surface-card border-none px-6">
        <AccordionTrigger className="py-4 text-left text-[16px] font-semibold text-foreground hover:no-underline">
          Antes de publicar: cómo preparar tus balances
        </AccordionTrigger>
        <AccordionContent className="pb-6 text-[15px] leading-[1.7] text-muted-foreground">
          <p className="mb-4">
            Un comprador serio pedirá números. Ten la documentación lista en una carpeta de Google
            Drive: al publicar solo pegas el enlace en el campo «Enlace a balances».
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <h4 className="mb-2 font-bold text-foreground">1. Reúne la documentación</h4>
              <ul className="flex list-disc flex-col gap-1.5 pl-5">
                <li>Balances y cuenta de resultados de los 3 últimos ejercicios cerrados.</li>
                <li>Facturación del ejercicio en curso, mes a mes.</li>
                <li>Deuda actual, préstamos y avales vigentes.</li>
                <li>Activos relevantes: maquinaria, vehículos, local, licencias.</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-bold text-foreground">2. Súbela a Google Drive</h4>
              <ul className="flex list-disc flex-col gap-1.5 pl-5">
                <li>Carpeta con nombre neutro, por ejemplo «Documentación económica 2025».</li>
                <li>Archivos en PDF o Excel, con nombres claros por año.</li>
                <li>
                  <strong className="text-foreground">
                    Compartir → Cualquier persona con el enlace → Lector
                  </strong>
                  , y copia el enlace.
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-bold text-foreground">3. Pega el enlace</h4>
              <p>
                Solo se comparte con la contraparte cuando hay match. No incluyas datos personales
                de empleados o clientes, y revoca el acceso al cerrar la operación.
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/* ───────────────────────── Página ───────────────────────── */

export function LandingScreen({
  onLogin,
  onStart,
}: {
  onLogin: () => void;
  onStart: (role: Role) => void;
}) {
  return (
    <>
      <SiteHeader onLogin={onLogin} />

      <main id="inicio" className="flex-1 [&_section]:scroll-mt-24">
        {/* HERO */}
        <section className="relative overflow-hidden px-5 pb-16 pt-12 max-[560px]:pt-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-36 -top-48 h-[600px] w-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 65%)",
            }}
          />
          <div className="relative z-[1] mx-auto w-full max-w-[880px]">
            <h1 className="max-w-[22ch] text-[48px] font-bold leading-[1.04] text-foreground max-[560px]:text-[34px]">
              Compra y venta de pymes en LATAM
            </h1>
            <p className="mt-5 max-w-[58ch] text-[18px] leading-[1.6] text-muted-foreground max-[560px]:text-[16px]">
              Publica tu empresa o define qué buscas comprar. Cuando lo que se ofrece y lo que se
              busca coinciden, les avisamos a ambos y los ponemos en contacto.
            </p>

            <div className="mt-9">
              <RoleDoors onStart={onStart} />
            </div>

            <p className="mt-5 text-[14px] text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={onLogin}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Ingresar
              </button>
            </p>
          </div>
        </section>

        {/* PROBLEMA */}
        <section aria-labelledby="problema" className="mx-auto w-full max-w-[880px] px-5 py-14">
          <SectionTitle id="problema">Vender una pyme hoy es un proceso desordenado</SectionTitle>
          <div className="grid gap-6 md:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div key={p.title}>
                <p.icon size={26} className="text-primary" aria-hidden />
                <h3 className="mt-3 text-[17px] font-bold text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.65] text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[20px] font-semibold text-primary">
            Vendo Mi Empresa ordena ese proceso.
          </p>
        </section>

        {/* CÓMO FUNCIONA */}
        <section
          aria-labelledby="como-funciona"
          className="mx-auto w-full max-w-[880px] px-5 py-14"
        >
          <SectionTitle id="como-funciona" intro="Elige tu caso. Son tres pasos en ambos lados.">
            Cómo funciona
          </SectionTitle>

          <Tabs defaultValue="seller">
            <TabsList className="mb-6 h-auto w-full max-w-[420px] rounded-xl bg-card p-1">
              <TabsTrigger
                value="seller"
                className="flex-1 rounded-lg py-2.5 text-[15px] font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Si vendes
              </TabsTrigger>
              <TabsTrigger
                value="buyer"
                className="flex-1 rounded-lg py-2.5 text-[15px] font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Si compras
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seller">
              <Steps steps={SELLER_STEPS} />
              <BalancesGuide />
              <button
                onClick={() => onStart("seller")}
                className="btn-primary mt-6 px-6 text-[15px]"
              >
                Publicar mi empresa
              </button>
            </TabsContent>

            <TabsContent value="buyer">
              <Steps steps={BUYER_STEPS} />
              <button
                onClick={() => onStart("buyer")}
                className="btn-primary mt-6 px-6 text-[15px]"
              >
                Definir mi búsqueda
              </button>
            </TabsContent>
          </Tabs>
        </section>

        {/* SEGURIDAD */}
        <section aria-labelledby="seguridad" className="mx-auto w-full max-w-[880px] px-5 py-14">
          <SectionTitle id="seguridad">Explora el mercado sin exponer que vendes</SectionTitle>
          <div className="grid gap-6 md:grid-cols-3">
            {TRUST.map((t) => (
              <div key={t.title} className="surface-card p-5">
                <t.icon size={24} className="text-primary" aria-hidden />
                <h3 className="mt-3 text-[16px] font-bold text-foreground">{t.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.65] text-muted-foreground">{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="preguntas" className="mx-auto w-full max-w-[880px] px-5 py-14">
          <SectionTitle id="preguntas">Preguntas frecuentes</SectionTitle>
          <Accordion type="single" collapsible className="flex flex-col gap-2.5">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                className="surface-card border-none px-6"
              >
                <AccordionTrigger className="py-4 text-left text-[16px] font-semibold text-foreground hover:no-underline max-[560px]:text-[15px]">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[15px] leading-[1.75] text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto w-full max-w-[880px] px-5 pb-20 pt-6">
          <h2 className="mb-6 text-[30px] font-bold text-foreground max-[560px]:text-[24px]">
            ¿De qué lado estás?
          </h2>
          <RoleDoors onStart={onStart} compact />
        </section>
      </main>
    </>
  );
}
