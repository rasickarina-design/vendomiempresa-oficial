import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { LoginScreen, RoleScreen, VerifyScreen, type Profile } from "@/components/auth-screens";
import { Dashboard } from "@/components/dashboard";
import { LandingScreen } from "@/components/landing";
import { SiteFooter } from "@/components/site-footer";

import { recordBuyer, recordCompany, recordContact } from "@/lib/admin-db";
import { fetchPublicCompany, toCompany } from "@/lib/public-company";
import {
  KEY_BUYERS,
  KEY_COMPANIES,
  KEY_CONTACTS,
  loadList,
  saveList,
  type Buyer,
  type Company,
  type ContactLog,
  type Role,
} from "@/lib/marketplace";

const TITLE = "Vendomiempresa — Marketplace de compra y venta de empresas";
const DESCRIPTION =
  "Publica tu empresa en venta o define qué quieres comprar. Acceso sin contraseña y matches automáticos entre vendedores y compradores.";


export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    empresa: typeof search.empresa === "string" ? search.empresa : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "empresas en venta, comprar empresa, vender empresa, traspaso de negocios, marketplace de empresas, compraventa de pymes",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Vendomiempresa",
          description: DESCRIPTION,
          inLanguage: "es",
          url: "/",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "¿Cómo publico mi empresa en venta?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Crea tu cuenta con un código de un solo uso enviado a tu correo, elige el rol de vendedor y completa los datos de la empresa: sector, ubicación, facturación y precio.",
              },
            },
            {
              "@type": "Question",
              name: "¿Cómo encuentro empresas que se ajusten a lo que busco?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Define tu perfil de comprador con sectores, presupuesto y ubicación preferida, y la plataforma te muestra automáticamente los matches disponibles.",

              },
            },
            {
              "@type": "Question",
              name: "¿En qué monedas se publican los precios?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Los precios y presupuestos se expresan en dólares (USD) o en euros (EUR).",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

const emptyProfile: Profile = {
  name: "",
  sectors: "",
  budgetMin: "",
  budgetMax: "",
  currency: "USD",
  locationPref: "",
  country: "",
  linkedin: "",
  thesis: "",
};

type Screen = "landing" | "login" | "verify" | "role" | "dashboard";

function Index() {
  const { empresa } = Route.useSearch();
  const [screen, setScreen] = useState<Screen>(empresa ? "login" : "landing");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pendingCode, setPendingCode] = useState("");
  const [codeExpires, setCodeExpires] = useState(0);
  const [role, setRole] = useState<Role>("buyer");
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [contacts, setContacts] = useState<ContactLog[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setCompanies(loadList<Company>(KEY_COMPANIES));
    setBuyers(loadList<Buyer>(KEY_BUYERS));
    setContacts(loadList<ContactLog>(KEY_CONTACTS));
  }, []);

  /* Empresa compartida por enlace: la incorporamos al listado local. */
  useEffect(() => {
    if (!empresa) return;
    void fetchPublicCompany(empresa).then((p) => {
      if (!p) return;
      setCompanies((prev) => (prev.some((c) => c.id === p.share_ref) ? prev : [toCompany(p), ...prev]));
    });
  }, [empresa]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 3400);
  }, []);

  const handleVerified = () => {
    const existing = buyers.find((b) => b.email === email);
    if (existing) {
      setRole(existing.role || "buyer");
      setProfile({
        name: existing.name,
        sectors: existing.sectors,
        budgetMin: existing.budgetMin,
        budgetMax: existing.budgetMax,
        currency: existing.currency,
        locationPref: existing.locationPref,
        country: existing.country ?? "",
        linkedin: existing.linkedin ?? "",
        thesis: existing.thesis,
      });
      setScreen("dashboard");
      showToast("¡Bienvenido/a de nuevo!");
      return;
    }
    setScreen("role");
  };


  return (
    <div className="flex min-h-screen flex-col">

      {screen === "landing" && <LandingScreen onLogin={() => setScreen("login")} />}

      {screen === "login" && (
        <LoginScreen
          onCode={({ email: e, phone: p, code, expires }) => {
            setEmail(e);
            setPhone(p);
            setPendingCode(code);
            setCodeExpires(expires);
            setScreen("verify");
          }}
          onHome={() => setScreen("landing")}
          notice={
            empresa
              ? "Has abierto una empresa en venta compartida contigo. Regístrate como comprador para verla completa."
              : undefined
          }
        />

      )}

      {screen === "verify" && (
        <VerifyScreen
          email={email}
          pendingCode={pendingCode}
          codeExpires={codeExpires}
          onVerified={handleVerified}
          onBack={() => setScreen("login")}
          onTooManyAttempts={() => {
            setScreen("login");
            showToast("Demasiados intentos fallidos. Pedí un nuevo código.");
          }}
        />
      )}

      {screen === "role" && (
        <RoleScreen
          onPick={(r) => {
            setRole(r);
            setScreen("dashboard");
          }}
        />
      )}


      {screen === "dashboard" && (
        <Dashboard
          email={email}
          phone={phone}
          role={role}
          profile={profile}
          companies={companies}
          buyers={buyers}
          contacts={contacts}
          onPublish={(c) => {
            const next = [c, ...companies];
            setCompanies(next);
            saveList(KEY_COMPANIES, next);
            void recordCompany(c);
            showToast("¡Empresa publicada con éxito!");
          }}
          onDelete={(id) => {
            const next = companies.filter((c) => c.id !== id);
            setCompanies(next);
            saveList(KEY_COMPANIES, next);
            showToast("Empresa eliminada.");
          }}
          onSaveBuyer={(b, p) => {
            setProfile({ ...profile, ...p });
            setRole(b.role);
            const idx = buyers.findIndex((x) => x.email === email);
            const next = idx >= 0 ? buyers.map((x, i) => (i === idx ? b : x)) : [b, ...buyers];
            setBuyers(next);
            saveList(KEY_BUYERS, next);
            void recordBuyer(b);
            showToast("¡Tu búsqueda se ha guardado! Ya puedes ver tus matches.");
          }}
          onContact={(key) => {
            if (contacts.some((c) => c.key === key)) return;
            const next = [...contacts, { key, at: Date.now() }];
            setContacts(next);
            saveList(KEY_CONTACTS, next);
            const [buyerEmail, companyId] = key.split("::");
            void recordContact({
              buyerEmail,
              companyName: companies.find((c) => c.id === companyId)?.name ?? "",
              companyRef: companyId,
              direction: buyerEmail === email ? "buyer_to_seller" : "seller_to_buyer",
            });
          }}
          onProfileName={(n) => setProfile((prev) => ({ ...prev, name: n }))}
          onLogout={() => {
            setEmail("");
            setPhone("");
            setProfile(emptyProfile);
            setRole("buyer");
            setScreen("login");
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[100] max-w-[90vw] -translate-x-1/2 rounded-full border border-primary-dim bg-card px-5 py-3 text-center text-[13px] font-semibold text-primary shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          {toast}
        </div>
      )}

      <SiteFooter />
    </div>

  );
}
