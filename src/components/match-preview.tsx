import { useState } from "react";
import MatchNotificationEmail from "@/lib/email-templates/match-notification";

type Row = Record<string, unknown>;
const s = (v: unknown) => (v == null ? "" : String(v));
const join = (...parts: unknown[]) => parts.map(s).filter((p) => p && p !== "—").join(", ") || "—";

function sellerItems(r: Row) {
  return [
    `${s(r.comprador_nombre) || "Comprador"}${r.comprador_rol ? ` (${s(r.comprador_rol)})` : ""} busca ${s(r.comprador_sectores)} · presupuesto ${s(r.comprador_presupuesto)}`,
    `Contacto: ${s(r.comprador_email)}${r.comprador_telefono ? ` · Tel. ${s(r.comprador_telefono)}` : ""}${r.comprador_whatsapp ? ` · WhatsApp ${s(r.comprador_whatsapp)}` : ""}`,
    `Ubicación buscada: ${join(r.comprador_ubicacion_buscada, r.comprador_pais)}`,
  ];
}

function buyerItems(r: Row) {
  return [
    `${s(r.empresa_nombre)} · ${s(r.empresa_sector)} · ${s(r.empresa_precio)}`,
    `Contacto: ${s(r.vendedor_nombre) || "Vendedor"}${r.vendedor_puesto ? ` (${s(r.vendedor_puesto)})` : ""} · ${s(r.vendedor_email)}${r.vendedor_telefono ? ` · Tel. ${s(r.vendedor_telefono)}` : ""}${r.vendedor_whatsapp ? ` · WhatsApp ${s(r.vendedor_whatsapp)}` : ""}`,
    `Ubicación: ${join(r.empresa_direccion, r.empresa_ciudad, r.empresa_codigo_postal, r.empresa_pais)}`,
    ...(r.empresa_google_maps ? [`Google Maps: ${s(r.empresa_google_maps)}`] : []),
  ];
}

function Field({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="flex gap-2 text-[12.5px]">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className="break-words text-foreground">{s(value) || "—"}</span>
    </div>
  );
}

export function MatchPreview({ row, onClose }: { row: Row; onClose: () => void }) {
  const [view, setView] = useState<"summary" | "seller" | "buyer">("summary");
  const tabs = [
    { id: "summary", label: "Resumen del match" },
    { id: "seller", label: "Email al vendedor" },
    { id: "buyer", label: "Email al comprador" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4" onClick={onClose}>
      <div
        className="surface-card max-h-[90vh] w-full max-w-3xl overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold">{s(row.match)}</h2>
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={onClose}>
            Cerrar ✕
          </button>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
                view === t.id ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {view === "summary" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 rounded-xl border border-border p-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-primary">Vende</p>
              <Field label="Empresa" value={row.empresa_nombre} />
              <Field label="Sector" value={row.empresa_sector} />
              <Field label="Precio" value={row.empresa_precio} />
              <Field label="Ubicación" value={join(row.empresa_ciudad, row.empresa_pais)} />
              <Field label="Vendedor" value={row.vendedor_nombre} />
              <Field label="Email" value={row.vendedor_email} />
              <Field label="Teléfono" value={row.vendedor_telefono} />
              <Field label="Email match" value={row.email_match_vendedor_enviado} />
            </div>
            <div className="space-y-1.5 rounded-xl border border-border p-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-primary">Compra</p>
              <Field label="Comprador" value={row.comprador_nombre} />
              <Field label="Rol" value={row.comprador_rol} />
              <Field label="Sectores" value={row.comprador_sectores} />
              <Field label="Presupuesto" value={row.comprador_presupuesto} />
              <Field label="Busca en" value={join(row.comprador_ubicacion_buscada, row.comprador_pais)} />
              <Field label="Email" value={row.comprador_email} />
              <Field label="Teléfono" value={row.comprador_telefono} />
              <Field label="Email match" value={row.email_match_comprador_enviado} />
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[var(--email-preview-bg,#ffffff)] p-2">
            <p className="px-2 pb-2 text-[12px] text-muted-foreground">
              Para: {s(view === "seller" ? row.vendedor_email : row.comprador_email)} · Asunto: Tienes un nuevo match
            </p>
            <MatchNotificationEmail
              audience={view}
              matchCount={1}
              items={view === "seller" ? sellerItems(row) : buyerItems(row)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
