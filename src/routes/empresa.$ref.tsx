import { MapPin } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { fetchPublicCompany, type PublicCompany } from "@/lib/public-company";
import { fmtMoney } from "@/lib/marketplace";
import logoAsset from "@/assets/logo.jpg.asset.json";

const TITLE = "Empresa en venta — Vendomiempresa";
const DESCRIPTION =
  "Ficha de una empresa en venta publicada en Vendomiempresa. Regístrate como comprador para ver los datos completos y contactar.";

export const Route = createFileRoute("/empresa/$ref")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: EmpresaPage,
});

function EmpresaPage() {
  const { ref } = Route.useParams();
  const [company, setCompany] = useState<PublicCompany | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void fetchPublicCompany(ref).then((c) => {
      if (!active) return;
      setCompany(c);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [ref]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <nav className="flex items-center justify-between border-b border-border bg-card/95 px-5 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoAsset.url} alt="Vendomiempresa" className="h-9 w-9 rounded-md object-cover" />
          <span className="text-[17px] font-extrabold tracking-tight">VENDO MI EMPRESA</span>
        </Link>
        <Link to="/" className="text-[13px] text-primary underline">
          Ir al inicio
        </Link>
      </nav>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando la ficha…</p>
        ) : !company ? (
          <div className="surface-card p-6">
            <h1 className="mb-2 text-xl font-bold">Esta empresa ya no está disponible</h1>
            <p className="text-sm text-muted-foreground">
              El enlace puede haber caducado o la publicación fue retirada. Explora otras oportunidades registrándote
              como comprador.
            </p>
          </div>
        ) : (
          <article className="surface-card p-6">
            <span className="pill bg-primary-soft text-[10.5px] uppercase tracking-[0.08em] text-primary">
              {company.sector}
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">{company.name}</h1>
            {(company.city || company.country) && (
              <p className="mt-1 text-xs text-muted-foreground">
                <MapPin className="mr-1 inline align-[-2px]" size={12} strokeWidth={2} /> {[company.city, company.country].filter((x) => x && x !== "—").join(" · ")}
              </p>
            )}
            {company.age && company.age !== "—" && (
              <p className="mt-1 text-[11.5px] text-subtle-foreground">Años operativos: {company.age}</p>
            )}
            <p className="mt-4 text-[14px] leading-relaxed text-foreground/85">{company.description}</p>

            <div className="mt-5 flex justify-between border-t border-border-soft pt-4">
              <div>
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.06em] text-subtle-foreground">
                  Facturación anual
                </p>
                <p className="font-mono text-sm font-bold">{company.revenue || "A consultar"}</p>
              </div>
              <div className="text-right">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.06em] text-subtle-foreground">
                  Precio de venta
                </p>
                <p className="font-mono text-sm font-bold">
                  {fmtMoney(company.price_amount, company.price_currency ?? "USD")}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-primary-dim bg-primary-soft p-4">
              <p className="text-[13px] font-semibold text-primary">
                Para ver los datos completos y contactar con quien vende, regístrate como comprador.
              </p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                El acceso es con un código de un solo uso enviado a tu correo. Sin coste y sin comisiones.
              </p>
              <Link
                to="/"
                search={{ empresa: company.share_ref }}
                className="mt-3 inline-block rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-primary-foreground"
              >
                Registrarme como comprador →
              </Link>
            </div>
          </article>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
