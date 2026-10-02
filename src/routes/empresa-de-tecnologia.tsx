import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

const TITLE = "Empresa de tecnología — En construcción | Vendo Mi Empresa";
const DESCRIPTION = "Sección para empresas de tecnología en Vendo Mi Empresa. En construcción: la nueva versión saldrá en 2027.";

export const Route = createFileRoute("/empresa-de-tecnologia")({
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
  component: TechPage,
});

function TechPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <Construction className="h-16 w-16 text-primary" strokeWidth={2} />
        <h1 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl">En construcción</h1>
        <p className="max-w-xl text-xl text-muted-foreground">Saldrá la nueva versión en el 2027.</p>
        <Link to="/" className="btn-primary px-6 py-3">← Volver al inicio</Link>
      </main>
      <SiteFooter />
    </div>
  );
}
