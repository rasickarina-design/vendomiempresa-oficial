import logoAsset from "@/assets/logo.jpg.asset.json";
import { HazardBanner } from "@/components/hazard-stripe";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿En qué me puede ayudar la plataforma?",
    a: "Además de conectar compradores y vendedores, podemos ayudarte a armar una carpeta de presentación de tu empresa para el comprador, analizar los números del negocio si estás del lado comprador, y ponerte en contacto con bancos internacionales y family desks que puedan acompañar la operación.",
  },
  {
    q: "¿Qué tipo de empresas se pueden publicar?",
    a: "Se pueden publicar empresas de cualquier sector, incluidas las de tecnología y software que ya tengan una plataforma construida y estén monetizando. Si tu negocio factura, tiene usuarios o clientes de pago y un modelo de ingresos probado, encaja en la categoría Tecnología y software y puede aparecer en las búsquedas de compradores interesados en activos digitales.",
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
    q: "¿Se muestran mis datos de contacto a cualquiera?",
    a: "No. Mientras no haya match, tus datos de contacto no se muestran a ningún otro usuario. Cuando la coincidencia se produce, se comparten con esa contraparte concreta para que podáis hablar directamente, sin intermediarios ni comisiones de intermediación.",
  },
  {
    q: "¿Publicar mi empresa es público?",
    a: "Publicas los datos del negocio —sector, facturación, ubicación, precio solicitado— para que el sistema pueda cruzarlos con las búsquedas activas. Tu identidad y tus datos de contacto quedan reservados hasta que exista un match, así puedes explorar el mercado sin exponer que estás vendiendo.",
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
    q: "Si soy un banco o family desk, ¿cómo obtengo el listado de empresas en venta?",
    a: "Si sos un banco o family desk interesado en nuestra base de datos, podés escribirnos a contact@makebusinessesflow.com o suscribirte como comprador y buscar tu match dentro de la plataforma.",
  },
  {
    q: "¿Tiene coste usar la plataforma?",
    a: "Publicar tu empresa, definir tu criterio de búsqueda y recibir matches no tiene coste, y el contacto entre las partes es directo: no cobramos comisión sobre la operación entre las partes.",
  },
  {
    q: "¿Cómo funciona el acceso con código?",
    a: "No usas contraseña. Introduces tu correo en la pantalla de acceso y te enviamos un código numérico de un solo uso. Lo copias en la aplicación y entras. El código caduca a los 5 minutos y solo sirve una vez, así que nadie puede reutilizarlo. Si caduca, pides uno nuevo desde la misma pantalla.",
  },
  {
    q: "¿Necesito crear una contraseña?",
    a: "No. El acceso es siempre con el código que llega a tu correo, así no hay contraseñas que recordar, ni que reciclar, ni que se puedan filtrar. Cada vez que quieras entrar desde un dispositivo nuevo, repites el mismo paso de 30 segundos.",
  },
  {
    q: "¿Qué pasa si no me llega el código?",
    a: "Primero revisa las carpetas de spam y promociones, y comprueba que el correo esté bien escrito (sin espacios ni letras de más). Si tu correo es corporativo, puede haber un filtro interno retrasándolo un minuto. Puedes volver a solicitar el código desde la pantalla de acceso todas las veces que necesites: siempre vale el último que hayas recibido.",
  },
];






function LoginButton({ onLogin, className = "" }: { onLogin: () => void; className?: string }) {
  return (
    <div className={`flex w-full justify-center ${className}`}>
      <button
        className="btn-primary min-h-[72px] w-full max-w-[360px] px-10 py-5 text-[24px] uppercase tracking-[0.02em] max-[560px]:max-w-full max-[560px]:text-[22px]"
        onClick={onLogin}
      >
        Login →
      </button>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-[880px] px-6 py-10 max-[560px]:py-8">
      <h2 className="mb-4 text-[26px] font-bold leading-tight text-primary max-[560px]:text-[22px]">{title}</h2>
      <div className="flex flex-col gap-4 text-[16px] leading-[1.75] text-foreground max-[560px]:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export function LandingScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <main className="flex-1">
      <HazardBanner text="VENDO" variant="solid" />

      <section className="relative overflow-hidden px-6 pb-12 pt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-36 -top-48 h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 65%)",
          }}
        />
        <div className="relative z-[1] mx-auto w-full max-w-[880px]">
          <img src={logoAsset.url} alt="Logo Vendo Mi Empresa" className="mb-5 h-20 w-20 rounded-xl object-contain" />
          <h1 className="mb-4 text-[44px] font-bold uppercase leading-[1.05] tracking-[0.02em] text-primary max-[560px]:text-[32px]">
            Vendo Mi Empresa
          </h1>

          <p className="mb-4 text-[20px] font-semibold leading-snug text-foreground max-[560px]:text-[18px]">
            El lugar donde vendedores y compradores de empresas se encuentran.
          </p>
          <p className="mb-7 max-w-[640px] text-[16px] leading-[1.75] text-foreground/90 max-[560px]:text-[15px]">
            Publica tu empresa o define qué estás buscando comprar. Nosotros te avisamos cuando hay match y te
            ponemos en contacto directo con la otra parte.
          </p>

          <LoginButton onLogin={onLogin} />
        </div>
      </section>

      <Section title="El problema">
        <p>
          Vender o comprar una pequeña o mediana empresa hoy es un proceso desordenado: contactos personales,
          intermediarios informales, anuncios sueltos en grupos de WhatsApp o redes sociales. No hay un lugar
          centralizado donde un vendedor pueda mostrar su negocio de forma ordenada, ni donde un comprador pueda
          filtrar oportunidades según lo que realmente busca.
        </p>
        <p className="font-semibold text-primary">Vendo Mi Empresa ordena ese proceso.</p>
      </Section>

      <Section title="Cómo funciona">
        <div className="surface-card rounded-[16px] px-6 py-5">
          <h3 className="mb-2 text-[17px] font-bold text-foreground">1. Entras en segundos</h3>
          <p>
            Solo necesitas tu correo y tu teléfono. Te enviamos un código de un solo uso para confirmar que eres tú,
            sin contraseñas que crear ni recordar.
          </p>
        </div>
        <div className="surface-card rounded-[16px] px-6 py-5">
          <h3 className="mb-2 text-[17px] font-bold text-foreground">2. Cuentas qué buscas</h3>
          <ul className="flex flex-col gap-2 pl-5">
            <li className="list-disc">
              <strong className="text-foreground">Si vendes:</strong> publicas los datos de tu empresa — sector,
              ubicación, antigüedad, facturación, precio y motivo de venta.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Si compras:</strong> defines tu criterio de búsqueda — sectores de
              interés, presupuesto y ubicación preferida.
            </li>
          </ul>
        </div>
        <div className="surface-card rounded-[16px] px-6 py-5">
          <h3 className="mb-2 text-[17px] font-bold text-foreground">3. Te avisamos cuando hay match</h3>
          <p>
            Cuando una empresa publicada coincide con lo que un comprador está buscando, se genera un match
            automático para ambas partes. Desde ahí, cualquiera de las dos puede escribir directamente a la otra con
            un solo clic.
          </p>
        </div>
      </Section>

      <Section title="Para quienes venden">
        <p>
          Deja de salir a buscar compradores uno por uno. Publica tu empresa una sola vez y deja que los compradores
          interesados lleguen a ti, ya filtrados por sector y presupuesto.
        </p>
        <ul className="flex flex-col gap-2 pl-5">
          <li className="list-disc">Publicación en minutos, sin intermediarios.</li>
          <li className="list-disc">Ves quién está realmente interesado antes de responder.</li>
          <li className="list-disc">Contacto directo, sin comisiones de intermediación.</li>
        </ul>
      </Section>

      <Section title="Prepara tus balances antes de publicar">
        <p>
          Un comprador serio pedirá números. Ten la documentación económica lista y alojada en un enlace de Google
          Drive: en la publicación solo tendrás que pegar ese enlace en el campo «Enlace a balances».
        </p>
        <div className="surface-card rounded-[16px] px-6 py-5">
          <h3 className="mb-2 text-[17px] font-bold text-foreground">1. Reúne la documentación</h3>
          <ul className="flex flex-col gap-2 pl-5">
            <li className="list-disc">Balances y cuenta de resultados de los 3 últimos ejercicios cerrados.</li>
            <li className="list-disc">Facturación del ejercicio en curso (acumulado mes a mes).</li>
            <li className="list-disc">Deuda actual, préstamos y avales vigentes, si los hay.</li>
            <li className="list-disc">Inventario de activos relevantes: maquinaria, vehículos, local, licencias.</li>
          </ul>
        </div>
        <div className="surface-card rounded-[16px] px-6 py-5">
          <h3 className="mb-2 text-[17px] font-bold text-foreground">2. Súbelo a Google Drive</h3>
          <ul className="flex flex-col gap-2 pl-5">
            <li className="list-disc">
              Crea una carpeta en Google Drive con un nombre neutro (por ejemplo, «Documentación económica 2024»).
            </li>
            <li className="list-disc">Sube los archivos en PDF o Excel, con nombres claros por año.</li>
            <li className="list-disc">
              Pulsa <strong className="text-foreground">Compartir → Cualquier persona con el enlace → Lector</strong> y
              copia el enlace.
            </li>
          </ul>
        </div>
        <div className="surface-card rounded-[16px] px-6 py-5">
          <h3 className="mb-2 text-[17px] font-bold text-foreground">3. Pega el enlace en tu publicación</h3>
          <p>
            Añade el enlace de la carpeta en el campo «Enlace a balances» al publicar tu empresa. Solo se comparte con
            la contraparte cuando se produce un match, nunca con visitantes que exploran el listado.
          </p>
        </div>
        <p className="text-muted-foreground">
          Recomendación: no incluyas datos personales de empleados o clientes, y revoca el acceso al enlace cuando
          cierres la operación.
        </p>
      </Section>


      <Section title="Para quienes compran">
        <p>
          Deja de revisar anuncio por anuncio buscando algo que tenga sentido. Define tu criterio una vez y la
          plataforma te muestra solo lo que encaja contigo.
        </p>
        <ul className="flex flex-col gap-2 pl-5">
          <li className="list-disc">Filtras por sector, presupuesto y ubicación.</li>
          <li className="list-disc">Recibes avisos de match, no ruido.</li>
          <li className="list-disc">Contactas con el vendedor con un mensaje que ya incluye tus datos.</li>
        </ul>
      </Section>

      <Section title="Seguridad y privacidad">
        <p>
          <strong className="text-foreground">Acceso sin contraseñas.</strong> Verificamos tu identidad con un código
          de un solo uso enviado a tu correo, válido durante 5 minutos.
        </p>
        <p>
          <strong className="text-foreground">Tú controlas qué compartes.</strong> Tus datos de contacto solo se
          muestran cuando hay un match real.
        </p>
        <p>
          <strong className="text-foreground">Sin intermediarios ocultos.</strong> El contacto entre las partes es
          directo.
        </p>
      </Section>

      <section className="mx-auto w-full max-w-[880px] px-6 pb-4 pt-4">
        <h2 className="mb-2 text-[26px] font-bold text-primary max-[560px]:text-[22px]">Preguntas frecuentes</h2>
        <p className="mb-5 text-[15px] leading-[1.7] text-muted-foreground">
          Pulsa cada pregunta para desplegar la respuesta.
        </p>

        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`faq-${i}`}
              className="surface-card rounded-[16px] border-none px-6"
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




      <section className="mx-auto w-full max-w-[880px] px-6 pb-16 pt-4">
        <div className="surface-card rounded-[20px] px-7 py-8">
          <h2 className="mb-3 text-[26px] font-bold text-primary max-[560px]:text-[22px]">Empieza ahora</h2>
          <p className="mb-6 text-[16px] leading-[1.75] text-foreground max-[560px]:text-[15px]">
            Tanto si buscas vender tu empresa como encontrar la próxima para comprar, el primer paso te lleva menos
            de un minuto.
          </p>

          <LoginButton onLogin={onLogin} />
        </div>
      </section>
    </main>
  );
}
