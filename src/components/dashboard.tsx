import { useMemo, useState } from "react";
import type { Buyer, Company, ContactLog, Role } from "@/lib/marketplace";
import { contactKey, fmtMoney, isMatch, mailtoLink, maskEmail } from "@/lib/marketplace";
import type { Profile } from "./auth-screens";
import logoAsset from "@/assets/logo.jpg.asset.json";

interface Props {
  email: string;
  phone: string;
  role: Role;
  profile: Profile;
  companies: Company[];
  buyers: Buyer[];
  contacts: ContactLog[];
  onPublish: (c: Company) => void;
  onDelete: (id: string) => void;
  onSaveBuyer: (b: Buyer, profile: Profile) => void;
  onContact: (key: string) => void;
  onLogout: () => void;
}

type Tab = "explore" | "publish" | "buyerprofile" | "matches";

export function Dashboard(props: Props) {
  const { email, phone, role, profile, companies, buyers, contacts } = props;
  const [tab, setTab] = useState<Tab>(role === "buyer" ? "explore" : "publish");
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  const myBuyer = buyers.find((b) => b.email === email);
  const myCompanies = companies.filter((c) => c.owner === email);

  const sectors = useMemo(
    () => [...new Set(companies.map((c) => c.sector))].filter(Boolean),
    [companies],
  );

  const list = companies
    .filter((c) => !sectorFilter || c.sector === sectorFilter)
    .filter(
      (c) => !search || (c.name + c.desc + c.location).toLowerCase().includes(search.toLowerCase()),
    );

  let matchCount = 0;
  myCompanies.forEach((c) => (matchCount += buyers.filter((b) => isMatch(c, b)).length));
  if (myBuyer) matchCount += companies.filter((c) => isMatch(c, myBuyer)).length;

  const tabs: Array<{ id: Tab; label: string; badge?: number }> = [
    { id: "explore", label: "Explorar empresas" },
    { id: "publish", label: "Publicar mi empresa" },
    { id: "buyerprofile", label: "Buscar para comprar" },
    { id: "matches", label: "Mis matches", badge: matchCount },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2.5 border-b border-border-soft bg-background/90 px-7 py-4 backdrop-blur">
        <div className="flex items-center gap-2.5 font-display text-[26px] font-bold leading-tight text-primary max-[560px]:text-[22px]">
          <img
            src={logoAsset.url}
            alt="Logo Vendomiempresa"
            className="h-11 w-11 rounded-lg object-contain"
          />
          Vendomiempresa
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="pill border border-success/25 bg-success/10 text-success">🔒 Sesión verificada</span>
          <span className="pill border border-border bg-card text-[13px] text-muted-foreground">
            {profile.name} · {maskEmail(email)}
          </span>
          <button className="btn-ghost" onClick={props.onLogout}>
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] flex-1 px-7 pb-16 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Hola, {profile.name.split(" ")[0] || ""}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {companies.length} empresa{companies.length === 1 ? "" : "s"} publicada
            {companies.length === 1 ? "" : "s"} · {buyers.length} comprador
            {buyers.length === 1 ? "" : "es"} registrados
          </p>
        </div>

        <div className="mb-6 flex w-fit flex-wrap gap-1.5 rounded-[11px] border border-border bg-card p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-2.5 text-[13px] font-semibold transition ${
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {!!t.badge && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-px text-[9px] font-bold ${
                    tab === t.id ? "bg-primary-foreground text-primary" : "bg-destructive text-foreground"
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "explore" && (
          <Explore
            list={list}
            sectors={sectors}
            myBuyer={myBuyer}
            email={email}
            search={search}
            setSearch={setSearch}
            sectorFilter={sectorFilter}
            setSectorFilter={setSectorFilter}
            onDelete={props.onDelete}
          />
        )}
        {tab === "publish" && (
          <PublishForm
            onPublish={(c) => {
              props.onPublish(c);
              setTab("explore");
            }}
            email={email}
            phone={phone}
            ownerName={profile.name}
          />
        )}
        {tab === "buyerprofile" && (
          <BuyerForm
            profile={profile}
            onSave={(b, p) => {
              props.onSaveBuyer(b, p);
              setTab("matches");
            }}
            email={email}
            phone={phone}
            role={role}
          />
        )}
        {tab === "matches" && (
          <Matches
            myBuyer={myBuyer}
            myCompanies={myCompanies}
            companies={companies}
            buyers={buyers}
            contacts={contacts}
            onContact={props.onContact}
          />
        )}
      </main>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="px-5 py-16 text-center text-muted-foreground">
      <h3 className="mb-2 text-[17px] text-foreground">{title}</h3>
      <p className="text-[13px]">{text}</p>
    </div>
  );
}

function Explore({
  list,
  sectors,
  myBuyer,
  email,
  search,
  setSearch,
  sectorFilter,
  setSectorFilter,
  onDelete,
}: {
  list: Company[];
  sectors: string[];
  myBuyer?: Buyer;
  email: string;
  search: string;
  setSearch: (v: string) => void;
  sectorFilter: string;
  setSectorFilter: (v: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2.5">
        <input
          className="field-input min-w-[220px] flex-1 bg-card py-2.5"
          placeholder="Buscar por nombre, descripción o ubicación…"
          value={search}
          maxLength={100}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="field-input w-auto bg-card py-2.5"
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
        >
          <option value="">Todos los rubros</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Todavía no hay empresas para mostrar"
          text='Sé el primero en publicar en la pestaña "Publicar mi empresa".'
        />
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {list.map((c) => {
            const match = myBuyer ? isMatch(c, myBuyer) : false;
            return (
              <article
                key={c.id}
                className="surface-card p-5 transition hover:-translate-y-0.5 hover:border-primary-dim"
              >
                <div className="mb-2.5 flex items-start justify-between gap-2">
                  <span className="pill bg-primary-soft text-[10.5px] uppercase tracking-[0.08em] text-primary">
                    {c.sector}
                  </span>
                  {match && (
                    <span className="pill bg-success text-[10px] text-primary-foreground">★ Match con vos</span>
                  )}
                  {c.owner === email && (
                    <button className="text-[11px] text-destructive" onClick={() => onDelete(c.id)}>
                      Eliminar
                    </button>
                  )}
                </div>
                <h3 className="mb-1.5 text-[17px] font-bold">{c.name}</h3>
                <p className="mb-3 text-xs text-muted-foreground">
                  📍 {c.location}
                  {c.country && c.country !== "—" ? ` · ${c.country}` : ""}
                </p>
                <p className="mb-4 min-h-10 text-[13px] leading-relaxed text-foreground/80">{c.desc}</p>
                <div className="mb-3 flex justify-between border-t border-border-soft pt-3">
                  <div>
                    <p className="mb-0.5 text-[10px] uppercase tracking-[0.06em] text-subtle-foreground">
                      Facturación anual
                    </p>
                    <p className="font-mono text-sm font-bold">{c.revenue}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-0.5 text-[10px] uppercase tracking-[0.06em] text-subtle-foreground">
                      Precio de venta
                    </p>
                    <p className="font-mono text-sm font-bold">{fmtMoney(c.priceAmount, c.priceCurrency)}</p>
                  </div>
                </div>
                <p className="text-[11px] text-subtle-foreground">
                  Publicado por {c.ownerName} · {maskEmail(c.owner)}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

function PublishForm({
  onPublish,
  email,
  phone,
  ownerName,
}: {
  onPublish: (c: Company) => void;
  email: string;
  phone: string;
  ownerName: string;
}) {
  const [f, setF] = useState({
    name: "",
    sector: "",
    location: "",
    country: "",
    linkedin: "",
    age: "",
    revenue: "",
    price: "",
    currency: "USD",
    desc: "",
  });
  const [error, setError] = useState("");
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!f.name.trim() || !f.sector.trim() || !f.desc.trim()) {
      setError("Completá al menos nombre, rubro y descripción.");
      return;
    }
    setError("");
    onPublish({
      id: "c_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: f.name.trim(),
      sector: f.sector.trim(),
      location: f.location.trim() || "—",
      country: f.country.trim() || "—",
      linkedin: f.linkedin.trim(),
      age: f.age.trim() || "—",
      revenue: f.revenue.trim() || "No especificada",
      priceAmount: f.price ? Number(f.price) : null,
      priceCurrency: f.currency,
      desc: f.desc.trim(),
      owner: email,
      ownerName,
      ownerPhone: phone,
      createdAt: Date.now(),
    });
  };

  return (
    <div className="surface-card max-w-[660px] p-7">
      <h3 className="text-[15px] text-primary">Datos de la empresa</h3>
      <p className="mb-5 mt-1 text-[11.5px] text-subtle-foreground">
        Esta información será visible para compradores en la plataforma, junto con tu nombre y email.
      </p>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className="field-label">Nombre de la empresa</label>
          <input className="field-input" maxLength={100} value={f.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Rubro / Sector</label>
          <input
            className="field-input"
            maxLength={60}
            value={f.sector}
            onChange={(e) => set("sector", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Ubicación</label>
          <input
            className="field-input"
            maxLength={100}
            value={f.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">País</label>
          <input
            className="field-input"
            placeholder="Argentina"
            maxLength={60}
            value={f.country}
            onChange={(e) => set("country", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">LinkedIn de la empresa (opcional)</label>
          <input
            className="field-input"
            placeholder="https://www.linkedin.com/company/…"
            maxLength={200}
            value={f.linkedin}
            onChange={(e) => set("linkedin", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Antigüedad</label>
          <input className="field-input" maxLength={40} value={f.age} onChange={(e) => set("age", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Facturación anual</label>
          <input
            className="field-input"
            maxLength={40}
            value={f.revenue}
            onChange={(e) => set("revenue", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Precio de venta (monto)</label>
          <input
            className="field-input"
            type="number"
            value={f.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Moneda del precio</label>
          <select className="field-input" value={f.currency} onChange={(e) => set("currency", e.target.value)}>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Descripción y motivo de venta</label>
          <textarea
            className="field-input min-h-20 resize-y"
            maxLength={1000}
            value={f.desc}
            onChange={(e) => set("desc", e.target.value)}
          />
        </div>
      </div>
      {error && <p className="field-error">{error}</p>}
      <button className="btn-primary mt-5 w-full" onClick={submit}>
        Publicar empresa
      </button>
    </div>
  );
}

function BuyerForm({
  profile,
  onSave,
  email,
  phone,
  role,
}: {
  profile: Profile;
  onSave: (b: Buyer, p: Profile) => void;
  email: string;
  phone: string;
  role: Role;
}) {
  const [p, setP] = useState<Profile>(profile);
  const [error, setError] = useState("");
  const set = (k: keyof Profile, v: string) => setP((prev) => ({ ...prev, [k]: v }));

  const submit = () => {
    if (!p.sectors.trim()) {
      setError("Contanos al menos un rubro de interés.");
      return;
    }
    setError("");
    const nextRole: Role = role === "seller" ? "both" : role || "buyer";
    onSave(
      {
        email,
        phone,
        name: profile.name,
        sectors: p.sectors.trim(),
        budgetMin: p.budgetMin,
        budgetMax: p.budgetMax,
        currency: p.currency,
        locationPref: p.locationPref.trim(),
        country: p.country.trim(),
        linkedin: p.linkedin.trim(),
        thesis: p.thesis.trim(),
        role: nextRole,
        updatedAt: Date.now(),
      },
      p,
    );
  };

  return (
    <div className="surface-card max-w-[660px] p-7">
      <h3 className="text-[15px] text-primary">¿Qué empresa estás buscando?</h3>
      <p className="mb-5 mt-1 text-[11.5px] text-subtle-foreground">
        Con esto te avisamos qué anuncios hacen match contigo, y los vendedores pueden contactar contigo
        directamente.
      </p>
      <div className="mb-4">
        <label className="field-label">Sectores que te interesan (separados por comas)</label>
        <input
          className="field-input"
          placeholder="Hostelería, Logística, Software"

          maxLength={200}
          value={p.sectors}
          onChange={(e) => set("sectors", e.target.value)}
        />
      </div>
      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className="field-label">Presupuesto mínimo</label>
          <input
            className="field-input"
            type="number"
            value={p.budgetMin}
            onChange={(e) => set("budgetMin", e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Presupuesto máximo</label>
          <input
            className="field-input"
            type="number"
            value={p.budgetMax}
            onChange={(e) => set("budgetMax", e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="field-label">Moneda</label>
        <select className="field-input" value={p.currency} onChange={(e) => set("currency", e.target.value)}>
          <option>USD</option>
          <option>EUR</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="field-label">Ubicación preferida (opcional)</label>
        <input
          className="field-input"
          maxLength={100}
          value={p.locationPref}
          onChange={(e) => set("locationPref", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="field-label">País</label>
        <input
          className="field-input"
          placeholder="España"

          maxLength={60}
          value={p.country}
          onChange={(e) => set("country", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="field-label">LinkedIn (opcional)</label>
        <input
          className="field-input"
          placeholder="https://www.linkedin.com/in/tu-perfil"
          maxLength={200}
          value={p.linkedin}
          onChange={(e) => set("linkedin", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="field-label">Descripción de lo que buscas</label>
        <textarea
          className="field-input min-h-20 resize-y"
          maxLength={1000}
          value={p.thesis}
          onChange={(e) => set("thesis", e.target.value)}
        />
      </div>
      {error && <p className="field-error">{error}</p>}
      <button className="btn-primary mt-2 w-full" onClick={submit}>
        Guardar búsqueda
      </button>
    </div>
  );
}

function MatchRow({
  title,
  sub,
  href,
  sent,
  label,
  onClick,
}: {
  title: string;
  sub: string;
  href: string;
  sent: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="surface-card mb-2.5 flex flex-wrap items-center justify-between gap-3.5 px-4 py-3.5">
      <div className="min-w-[220px] flex-1">
        <p className="mb-0.5 text-sm font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <a
        href={href}
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[9px] px-3.5 py-2.5 text-[12.5px] font-bold no-underline ${
          sent ? "border border-success bg-input text-success" : "bg-primary text-primary-foreground"
        }`}
      >
        {sent ? "✓ Contactado" : label}
      </a>
    </div>
  );
}

function Matches({
  myBuyer,
  myCompanies,
  companies,
  buyers,
  contacts,
  onContact,
}: {
  myBuyer?: Buyer;
  myCompanies: Company[];
  companies: Company[];
  buyers: Buyer[];
  contacts: ContactLog[];
  onContact: (key: string) => void;
}) {
  const wasContacted = (k: string) => contacts.some((c) => c.key === k);
  const buyerMatches = myBuyer ? companies.filter((c) => isMatch(c, myBuyer)) : [];

  if (myCompanies.length === 0 && !myBuyer) {
    return (
      <EmptyState
        title="Todavía no has configurado nada para hacer match"
        text='Publica una empresa o completa tu búsqueda en "Buscar para comprar" para empezar a ver matches aquí.'

      />
    );
  }

  return (
    <>
      {myCompanies.length > 0 && (
        <section className="mb-9">
          <h3 className="text-[15px] text-primary">Compradores interesados en tus empresas</h3>
          <p className="mb-4 mt-1 text-[12.5px] text-muted-foreground">
            Compradores cuyos criterios de búsqueda coinciden con lo que publicaste.
          </p>
          {myCompanies.map((company) => {
            const matched = buyers.filter((b) => isMatch(company, b));
            if (matched.length === 0) {
              return (
                <div key={company.id} className="surface-card mb-2.5 px-4 py-3.5">
                  <p className="mb-0.5 text-sm font-bold">{company.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Todavía no hay compradores que hagan match con esta publicación.
                  </p>
                </div>
              );
            }
            return matched.map((b) => {
              const key = contactKey(b.email, company.id);
              const subject = `Interés en tu búsqueda de empresas — ${company.name}`;
              const body = `Hola ${b.name}:\n\nTe escribo desde Vendomiempresa porque tu búsqueda (${b.sectors}) coincide con mi empresa "${company.name}", ubicada en ${company.location}.\n\nFacturación anual: ${company.revenue}\nPrecio de venta: ${fmtMoney(company.priceAmount, company.priceCurrency)}\n\nMis datos de contacto:\n${company.ownerName}\n${company.ownerPhone}\n${company.owner}\n\nQuedo a tu disposición si quieres que hablemos.\n\nUn saludo.`;
              return (
                <MatchRow
                  key={key}
                  title={`${b.name} → interesado en ${company.name}`}
                  sub={`Busca: ${b.sectors} · Presupuesto: ${
                    b.budgetMin && b.budgetMax
                      ? fmtMoney(b.budgetMin, b.currency) + " – " + fmtMoney(b.budgetMax, b.currency)
                      : "No especificado"
                  }`}
                  href={mailtoLink(b.email, subject, body)}
                  sent={wasContacted(key)}
                  label="✉ Contactar comprador"
                  onClick={() => onContact(key)}
                />
              );
            });
          })}
        </section>
      )}

      {myBuyer && (
        <section className="mb-9">
          <h3 className="text-[15px] text-primary">Empresas que coinciden con tu búsqueda</h3>
          <p className="mb-4 mt-1 text-[12.5px] text-muted-foreground">
            Según los sectores y el presupuesto que definiste en "Buscar para comprar".
          </p>
          {buyerMatches.length === 0 ? (
            <EmptyState
              title="Todavía no hay matches"
              text="Aquí te mostraremos las empresas publicadas que coincidan con tu búsqueda."

            />
          ) : (
            buyerMatches.map((c) => {
              const key = contactKey(myBuyer.email, c.id);
              const subject = `Interesado/a en comprar tu empresa — ${c.name}`;
              const body = `Hola ${c.ownerName}:\n\nHe visto tu anuncio de "${c.name}" en Vendomiempresa y coincide con lo que estoy buscando (${myBuyer.sectors}).\n\n${
                myBuyer.thesis ? myBuyer.thesis + "\n\n" : ""
              }Mis datos de contacto:\n${myBuyer.name}\n${myBuyer.phone}\n${myBuyer.email}\n\nQuedo a la espera de tu respuesta.\n\nUn saludo.`;

              return (
                <MatchRow
                  key={key}
                  title={c.name}
                  sub={`${c.sector} · ${fmtMoney(c.priceAmount, c.priceCurrency)} · 📍 ${c.location}`}
                  href={mailtoLink(c.owner, subject, body)}
                  sent={wasContacted(key)}
                  label="✉ Contactar vendedor"
                  onClick={() => onContact(key)}
                />
              );
            })
          )}
        </section>
      )}
    </>
  );
}
