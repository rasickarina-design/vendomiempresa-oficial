import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, X } from "lucide-react";

type Row = { kind: string; sector: string; total: number };
const CONTACT = "contact@makebusinessesflow.com";

export function MarketStats() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    supabase.rpc("get_market_stats" as never).then(({ data }) => {
      setRows(((data as Row[] | null) ?? []).map((r) => ({ ...r, total: Number(r.total) })));
    });
  }, []);

  if (!rows) return <p className="text-muted-foreground">Cargando…</p>;

  const sum = (k: string) => rows.filter((r) => r.kind === k).reduce((a, r) => a + r.total, 0);
  const sectors = Array.from(new Set(rows.map((r) => r.sector))).sort();
  const get = (k: string, s: string) => rows.find((r) => r.kind === k && r.sector === s)?.total ?? 0;

  return (
    <div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {[
          ["vendo", "VENDO", "Empresas en venta"],
          ["compro", "COMPRO", "Búsquedas de compradores"],
        ].map(([k, label, sub]) => (
          <div key={k} className="surface-card p-6">
            <span className="rounded bg-primary px-2 py-0.5 text-sm font-bold text-primary-foreground">{label}</span>
            <div className="mt-3 text-4xl font-bold text-foreground">{sum(k)}</div>
            <div className="text-muted-foreground">{sub}</div>
          </div>
        ))}
      </div>

      {sectors.length === 0 ? (
        <p className="text-muted-foreground">Todavía no hay empresas cargadas.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setOpen(s)}
              className="surface-card cursor-pointer p-5 text-left transition hover:border-primary"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">{s}</span>
                <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
              </div>
              <div className="flex gap-2 text-sm">
                <span className="rounded bg-primary px-2 py-0.5 font-bold text-primary-foreground">VENDO {get("vendo", s)}</span>
                <span className="rounded border border-primary px-2 py-0.5 font-bold text-primary">COMPRO {get("compro", s)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4" onClick={() => setOpen(null)}>
          <div className="surface-card relative max-w-md p-7" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Cerrar" className="absolute right-3 top-3 text-muted-foreground" onClick={() => setOpen(null)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="mb-2 text-lg font-bold text-primary">{open}</h3>
            <p className="mb-5 text-foreground">
              Si quieres estos datos debes comunicarte con nosotros en <strong>{CONTACT}</strong>.
            </p>
            <a
              href={`mailto:${CONTACT}?subject=${encodeURIComponent("Información sector " + open)}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground"
            >
              <Mail className="h-4 w-4" /> Escribir email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
