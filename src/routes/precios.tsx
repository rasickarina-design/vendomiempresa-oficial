import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Landmark, Lock, Mail, Wallet } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

const TITLE = "Precios para family offices, fondos y bancos | Vendo Mi Empresa";
const DESCRIPTION =
  "Accede de forma privada a los datos de la plataforma Vendo Mi Empresa. Family offices, fondos de inversión y bancos: escríbenos para recibir precios.";
const EMAIL = "contact@makebusinessesflow.com";

export const Route = createFileRoute("/precios")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PricingPage,
});

const AUDIENCE = [
  { icon: Wallet, title: "Family offices", text: "Oportunidades de compra de pymes seleccionadas según tu perfil de inversión." },
  { icon: Building2, title: "Fondos de inversión", text: "Acceso a empresas en venta y demanda de compradores por sector y país." },
  { icon: Landmark, title: "Bancos", text: "Información para financiar operaciones de compraventa de empresas." },
];

function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-16">
        <Link to="/" className="text-sm text-muted-foreground transition hover:text-primary">← Volver al inicio</Link>
        <header className="space-y-4">
          <h1 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl">Precios</h1>
          <p className="text-xl text-muted-foreground">
            Los datos de la plataforma pueden compartirse con family offices, fondos y bancos de manera privada.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          {AUDIENCE.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5">
              <Icon className="mb-3 h-7 w-7 text-primary" />
              <h2 className="mb-2 font-bold uppercase">{title}</h2>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <section className="flex gap-3 rounded-lg border border-border bg-card p-5">
          <Lock className="h-6 w-6 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            La información se comparte siempre de forma privada y confidencial, solo con entidades que lo soliciten por email.
          </p>
        </section>

        <section className="space-y-4 rounded-lg border-2 border-primary p-6 text-center">
          <h2 className="text-2xl font-bold uppercase">Solicita los precios</h2>
          <p className="text-muted-foreground">Escríbenos indicando tu entidad y te enviaremos los precios.</p>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Solicitud de precios — Vendo Mi Empresa")}`}
            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            <Mail className="h-5 w-5" /> {EMAIL}
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
