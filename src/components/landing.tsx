import logoAsset from "@/assets/logo.jpg.asset.json";

function LoginButton({ onLogin, className = "" }: { onLogin: () => void; className?: string }) {
  return (
    <button className={`btn-primary ${className}`} onClick={onLogin}>
      Login →
    </button>
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
      <section className="relative overflow-hidden px-6 pb-12 pt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-36 -top-48 h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-14 top-8 z-[2] rotate-[38deg] select-none border-y-2 border-primary-foreground/20 bg-primary px-16 py-2 text-center text-[15px] font-extrabold uppercase tracking-[0.32em] text-primary-foreground shadow-[0_8px_24px_rgba(0,0,0,0.45)] max-[560px]:-right-12 max-[560px]:px-12 max-[560px]:text-[12px]"
        >
          Vende
        </div>
        <div className="relative z-[1] mx-auto w-full max-w-[880px]">
          <img src={logoAsset.url} alt="Logo Vendo Mi Empresa" className="mb-5 h-20 w-20 rounded-xl object-contain" />
          <h1 className="mb-4 text-[44px] font-bold uppercase leading-[1.05] tracking-[0.02em] text-primary max-[560px]:text-[32px]">
            Vendo Mi Empresa
          </h1>

          <p className="mb-4 text-[20px] font-semibold leading-snug text-foreground max-[560px]:text-[18px]">
            El lugar donde vendedores y compradores de empresas se encuentran.
          </p>
          <p className="mb-7 max-w-[640px] text-[16px] leading-[1.75] text-foreground/90 max-[560px]:text-[15px]">
            Publicá tu empresa o definí qué estás buscando comprar. Nosotros te avisamos cuando hay match, y te
            ponemos en contacto directo con la otra parte.
          </p>
          <LoginButton onLogin={onLogin} />
        </div>
      </section>

      <Section title="El problema">
        <p>
          Vender o comprar una empresa PyME hoy es un proceso desordenado: contactos personales, corredores
          informales, publicaciones sueltas en grupos de WhatsApp o redes sociales. No hay un lugar centralizado
          donde un vendedor pueda mostrar su negocio de forma prolija, ni donde un comprador pueda filtrar
          oportunidades según lo que realmente busca.
        </p>
        <p className="font-semibold text-primary">Empresas en Venta ordena ese proceso.</p>
      </Section>

      <Section title="Cómo funciona">
        <div className="surface-card rounded-[16px] px-6 py-5">
          <h3 className="mb-2 text-[17px] font-bold text-foreground">1. Entrás en segundos</h3>
          <p>
            Solo necesitás tu email y tu teléfono. Te enviamos un código de un solo uso para confirmar que sos vos —
            sin contraseñas que crear ni recordar.
          </p>
        </div>
        <div className="surface-card rounded-[16px] px-6 py-5">
          <h3 className="mb-2 text-[17px] font-bold text-foreground">2. Contás qué buscás</h3>
          <ul className="flex flex-col gap-2 pl-5">
            <li className="list-disc">
              <strong className="text-foreground">Si vendés:</strong> publicás los datos de tu empresa — rubro,
              ubicación, antigüedad, facturación, precio y motivo de venta.
            </li>
            <li className="list-disc">
              <strong className="text-foreground">Si comprás:</strong> definís tu criterio de búsqueda — rubros de
              interés, presupuesto y ubicación preferida.
            </li>
          </ul>
        </div>
        <div className="surface-card rounded-[16px] px-6 py-5">
          <h3 className="mb-2 text-[17px] font-bold text-foreground">3. Te avisamos cuando hay match</h3>
          <p>
            Cuando una empresa publicada coincide con lo que un comprador está buscando, se genera un match
            automático para ambos lados. Desde ahí, cualquiera de las dos partes puede escribirle directamente a la
            otra con un solo clic.
          </p>
        </div>
      </Section>

      <Section title="Para quienes venden">
        <p>
          Dejá de salir a buscar compradores uno por uno. Publicá tu empresa una sola vez y dejá que los compradores
          interesados lleguen a vos, ya filtrados por rubro y presupuesto.
        </p>
        <ul className="flex flex-col gap-2 pl-5">
          <li className="list-disc">Publicación en minutos, sin intermediarios.</li>
          <li className="list-disc">Ves quién está genuinamente interesado antes de responder.</li>
          <li className="list-disc">Contacto directo, sin comisiones de corretaje.</li>
        </ul>
      </Section>

      <Section title="Para quienes compran">
        <p>
          Dejá de revisar publicación por publicación buscando algo que tenga sentido. Definí tu criterio una vez y
          la plataforma te muestra solo lo que matchea con vos.
        </p>
        <ul className="flex flex-col gap-2 pl-5">
          <li className="list-disc">Filtrás por rubro, presupuesto y ubicación.</li>
          <li className="list-disc">Recibís alertas de match, no ruido.</li>
          <li className="list-disc">Contactás al vendedor con un mensaje que ya incluye tus datos.</li>
        </ul>
      </Section>

      <Section title="Seguridad y privacidad">
        <p>
          <strong className="text-foreground">Login sin contraseñas.</strong> Verificamos tu identidad con un código
          de un solo uso enviado a tu email, válido por 5 minutos.
        </p>
        <p>
          <strong className="text-foreground">Vos controlás qué compartís.</strong> Tus datos de contacto solo se
          muestran cuando hay un match real.
        </p>
        <p>
          <strong className="text-foreground">Sin intermediarios ocultos.</strong> El contacto entre las partes es
          directo.
        </p>
      </Section>

      <section className="mx-auto w-full max-w-[880px] px-6 pb-16 pt-4">
        <div className="surface-card rounded-[20px] px-7 py-8">
          <h2 className="mb-3 text-[26px] font-bold text-primary max-[560px]:text-[22px]">Empezá ahora</h2>
          <p className="mb-6 text-[16px] leading-[1.75] text-foreground max-[560px]:text-[15px]">
            Ya sea que estés buscando vender tu empresa o encontrar la próxima para comprar, el primer paso te toma
            menos de un minuto.
          </p>
          <LoginButton onLogin={onLogin} />
        </div>
      </section>
    </main>
  );
}
