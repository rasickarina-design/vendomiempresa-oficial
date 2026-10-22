import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { MatchPreview } from "@/components/match-preview";
import { supabase } from "@/integrations/supabase/client";
import { sendMatchReminder } from "@/lib/admin-reminders.functions";
import { downloadCsv, downloadXlsx } from "@/lib/admin-db";
import { getEmailStatuses, type EmailStatusByRecipient } from "@/lib/email-logs.functions";
import { fmtMoney, isMatch, type Buyer, type Company } from "@/lib/marketplace";

const TITLE = "Panel interno — Vendomiempresa";
const DESCRIPTION = "Acceso restringido al administrador: base de datos interna y exportación a CSV.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type TableName = "companies" | "buyers" | "contacts";

/** Reordena columnas para que dirección, ciudad, CP y país queden juntas. */
function groupAddress(list: Array<Record<string, unknown>>, group: string[]) {
  return list.map((r) => {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(r)) {
      if (group.includes(k)) {
        if (k === group.find((g) => g in r)) for (const g of group) if (g in r) out[g] = r[g];
      } else out[k] = r[k];
    }
    return out;
  });
}

/** Coloca primero los datos de la persona (nombre, email, teléfono, WhatsApp). */
function putFirst(list: Array<Record<string, unknown>>, first: string[]) {
  return list.map((r) => {
    const out: Record<string, unknown> = {};
    for (const k of first) if (k in r) out[k] = r[k];
    for (const k of Object.keys(r)) if (!(k in out) && k !== "id" && k !== "created_at") out[k] = r[k];
    if ("created_at" in r) out.created_at = r.created_at;
    if ("id" in r) out.id = r.id;
    return out;
  });
}

const TABLES: Array<{ name: TableName; label: string; file: string }> = [
  { name: "companies", label: "Vende empresas", file: "vende-empresas" },
  { name: "buyers", label: "Compra empresas", file: "compra-empresas" },
  { name: "contacts", label: "Matches completos", file: "matches" },
];

function stringValue(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}

function numberValue(value: unknown) {
  return value === null || value === undefined || value === "" ? null : Number(value);
}

function dbCompany(r: Record<string, unknown>): Company {
  return {
    id: stringValue(r.share_ref || r.id),
    name: stringValue(r.name),
    sector: stringValue(r.sector),
    location: stringValue(r.location),
    city: stringValue(r.city),
    postalCode: stringValue(r.postal_code),
    country: stringValue(r.country),
    linkedin: stringValue(r.linkedin),
    whatsapp: stringValue(r.whatsapp),
    googleProfile: stringValue(r.google_profile),
    mapsUrl: stringValue(r.maps_url),
    financialsUrl: stringValue(r.financials_url),
    websiteUrl: stringValue(r.website_url),
    age: stringValue(r.age),
    revenue: stringValue(r.revenue),
    priceAmount: numberValue(r.price_amount),
    priceCurrency: stringValue(r.price_currency || "USD"),
    desc: stringValue(r.description),
    owner: stringValue(r.owner_email),
    ownerName: stringValue(r.owner_name),
    ownerPosition: stringValue(r.owner_position),
    ownerPhone: stringValue(r.owner_phone),
    createdAt: new Date(stringValue(r.created_at)).getTime(),
  };
}

function dbBuyer(r: Record<string, unknown>): Buyer {
  const role = stringValue(r.role);
  return {
    email: stringValue(r.email),
    phone: stringValue(r.phone),
    name: stringValue(r.name),
    sectors: stringValue(r.sectors),
    budgetMin: r.budget_min === null || r.budget_min === undefined ? "" : String(Number(r.budget_min)),
    budgetMax: r.budget_max === null || r.budget_max === undefined ? "" : String(Number(r.budget_max)),
    currency: stringValue(r.currency || "USD"),
    locationPref: stringValue(r.location_pref),
    country: stringValue(r.country),
    linkedin: stringValue(r.linkedin),
    whatsapp: stringValue(r.whatsapp),
    position: stringValue(r.buyer_position),
    thesis: stringValue(r.thesis),
    role: role === "seller" || role === "both" ? role : "buyer",
    updatedAt: new Date(stringValue(r.created_at)).getTime(),
  };
}

function latestContactsByMatch(contacts: Array<Record<string, unknown>>) {
  const map = new Map<string, Record<string, unknown>>();
  for (const contact of contacts) {
    const buyerEmail = stringValue(contact.buyer_email).toLowerCase();
    const companyRef = stringValue(contact.company_ref);
    if (!buyerEmail || !companyRef) continue;
    const key = `${buyerEmail}::${companyRef}`;
    const current = map.get(key);
    if (!current || stringValue(contact.created_at) > stringValue(current.created_at)) map.set(key, contact);
  }
  return map;
}

function buildMatchRows(params: {
  companies: Array<Record<string, unknown>>;
  buyers: Array<Record<string, unknown>>;
  contacts: Array<Record<string, unknown>>;
  notifications: Array<Record<string, unknown>>;
}) {
  const companies = params.companies.map((row) => ({ row, company: dbCompany(row) }));
  const seenBuyers = new Set<string>();
  const buyers = params.buyers
    .filter((row) => {
      const email = stringValue(row.email).toLowerCase();
      if (!email || seenBuyers.has(email)) return false;
      seenBuyers.add(email);
      return true;
    })
    .map((row) => ({ row, buyer: dbBuyer(row) }));
  const contacted = latestContactsByMatch(params.contacts);
  const notificationsByKey = new Map<string, Array<Record<string, unknown>>>();
  for (const notification of params.notifications) {
    const key = stringValue(notification.match_key);
    if (!key) continue;
    const list = notificationsByKey.get(key) ?? [];
    list.push(notification);
    notificationsByKey.set(key, list);
  }

  const rows: Array<Record<string, unknown>> = [];
  for (const { row: companyRow, company } of companies) {
    for (const { row: buyerRow, buyer } of buyers) {
      if (!isMatch(company, buyer)) continue;
      const contact = contacted.get(`${buyer.email.toLowerCase()}::${company.id}`);
      const notificationKey = `${company.id}-${buyer.email.toLowerCase()}`;
      const notifications = notificationsByKey.get(notificationKey) ?? [];
      const sellerNotification = notifications.find((n) => stringValue(n.recipient_side) === "seller" && stringValue(n.template_name) === "match-notification");
      const buyerNotification = notifications.find((n) => stringValue(n.recipient_side) === "buyer" && stringValue(n.template_name) === "match-notification");
      const sellerReminder = notifications.find((n) => stringValue(n.recipient_side) === "seller" && stringValue(n.template_name) === "match-reminder");
      const buyerReminder = notifications.find((n) => stringValue(n.recipient_side) === "buyer" && stringValue(n.template_name) === "match-reminder");
      rows.push({
        match: `${company.name} ↔ ${buyer.name || buyer.email}`,
        motivo_match: "Sector + país + monto",
        email_match_vendedor_enviado: sellerNotification?.sent ? "Sí" : "No",
        fecha_email_match_vendedor: sellerNotification?.created_at ?? "",
        estado_email_match_vendedor: sellerNotification ? stringValue(sellerNotification.reason) || "Enviado" : "",
        email_match_comprador_enviado: buyerNotification?.sent ? "Sí" : "No",
        fecha_email_match_comprador: buyerNotification?.created_at ?? "",
        estado_email_match_comprador: buyerNotification ? stringValue(buyerNotification.reason) || "Enviado" : "",
        recordatorio_vendedor_enviado: sellerReminder?.sent ? "Sí" : "No",
        fecha_recordatorio_vendedor: sellerReminder?.created_at ?? "",
        estado_recordatorio_vendedor: sellerReminder ? stringValue(sellerReminder.reason) || "Enviado" : "",
        recordatorio_comprador_enviado: buyerReminder?.sent ? "Sí" : "No",
        fecha_recordatorio_comprador: buyerReminder?.created_at ?? "",
        estado_recordatorio_comprador: buyerReminder ? stringValue(buyerReminder.reason) || "Enviado" : "",
        contacto_realizado: contact ? "Sí" : "No",
        fecha_contacto: contact?.created_at ?? "",
        direccion_contacto: contact?.direction ?? "",
        empresa_nombre: company.name,
        empresa_sector: company.sector,
        empresa_precio: fmtMoney(company.priceAmount, company.priceCurrency),
        empresa_monto: company.priceAmount ?? "",
        empresa_moneda: company.priceCurrency,
        empresa_facturacion: company.revenue,
        empresa_anios_operando: company.age,
        empresa_descripcion: company.desc,
        empresa_direccion: company.location,
        empresa_ciudad: company.city,
        empresa_codigo_postal: company.postalCode,
        empresa_pais: company.country,
        empresa_google_maps: company.mapsUrl,
        empresa_perfil_google: company.googleProfile,
        empresa_web: company.websiteUrl,
        empresa_financieros_o_one_pager: company.financialsUrl,
        vendedor_nombre: company.ownerName,
        vendedor_puesto: company.ownerPosition,
        vendedor_email: company.owner,
        vendedor_telefono: company.ownerPhone,
        vendedor_whatsapp: company.whatsapp ?? "",
        vendedor_linkedin: company.linkedin,
        comprador_nombre: buyer.name,
        comprador_rol: buyer.position ?? "",
        comprador_email: buyer.email,
        comprador_telefono: buyer.phone,
        comprador_whatsapp: buyer.whatsapp ?? "",
        comprador_linkedin: buyer.linkedin,
        comprador_sectores: buyer.sectors,
        comprador_presupuesto: `${fmtMoney(buyer.budgetMin, buyer.currency)} – ${fmtMoney(buyer.budgetMax, buyer.currency)}`,
        comprador_presupuesto_min: buyer.budgetMin,
        comprador_presupuesto_max: buyer.budgetMax,
        comprador_moneda: buyer.currency,
        comprador_ubicacion_buscada: buyer.locationPref,
        comprador_pais: buyer.country,
        comprador_descripcion_busqueda: buyer.thesis,
        empresa_id: companyRow.id ?? "",
        empresa_ref: company.id,
        comprador_id: buyerRow.id ?? "",
        contacto_id: contact?.id ?? "",
      });
    }
  }

  return rows.sort((a, b) => String(b.contacto_realizado).localeCompare(String(a.contacto_realizado)));
}

function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reminderBusy, setReminderBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [rows, setRows] = useState<Record<TableName, Array<Record<string, unknown>>>>({
    companies: [],
    buyers: [],
    contacts: [],
  });
  const [tab, setTab] = useState<TableName>("companies");
  const [format, setFormat] = useState<"xlsx" | "csv">("xlsx");

  const refresh = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setSession(null);
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    setSession({ email: user.email ?? "" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    const admin = !!roles && roles.length > 0;
    setIsAdmin(admin);
    if (admin) {
      const [c, b, ct, nt, emailStatuses] = await Promise.all([
        supabase.from("companies").select("*").order("created_at", { ascending: false }),
        supabase.from("buyers").select("*").order("created_at", { ascending: false }),
        supabase.from("contacts").select("*").order("created_at", { ascending: false }),
        supabase.from("match_email_notifications").select("*").order("created_at", { ascending: false }),
        getEmailStatuses(),
      ]);
      const companies = (c.data ?? []) as Array<Record<string, unknown>>;
      const buyers = (b.data ?? []) as Array<Record<string, unknown>>;
      const contacts = (ct.data ?? []) as Array<Record<string, unknown>>;
      const notifications = (nt.data ?? []) as Array<Record<string, unknown>>;
      const statuses = emailStatuses as EmailStatusByRecipient;
      const emailColumns = (row: Record<string, unknown>, emailField: string) => {
        const status = statuses[stringValue(row[emailField]).toLowerCase()];
        return {
          ...row,
          email_enviado_al_registrarse: status?.sent ? "Sí" : "No",
          ultimo_email_registro: status?.lastSentAt ?? "",
          estado_email_registro: status?.lastStatus ?? "",
        };
      };
      setRows({
        companies: putFirst(groupAddress(companies.map((row) => emailColumns(row, "owner_email")), [
          "location",
          "city",
          "postal_code",
          "country",
          "maps_url",
          "website_url",
        ]), ["owner_name", "owner_position", "owner_email", "owner_phone", "whatsapp"]),
        buyers: putFirst(
          groupAddress(buyers.map((row) => emailColumns(row, "email")), ["location_pref", "country"]),
          ["name", "buyer_position", "email", "phone", "whatsapp"],
        ),
        contacts: buildMatchRows({ companies, buyers, contacts, notifications }),
      });
    }
    setChecking(false);
  }, []);

  const removeRow = async (r: Record<string, unknown>) => {
    if (tab !== "companies" && tab !== "buyers") return;
    const id = stringValue(r.id);
    const label = stringValue(tab === "companies" ? r.name : r.email);
    if (!id || !window.confirm(`¿Sacar a ${label}? Se borra su registro y deja de recibir matches.`)) return;
    const { error: err } = await supabase.from(tab).delete().eq("id", id);
    setNotice(err ? `No se pudo sacar: ${err.message}` : `${label} fue eliminado.`);
    if (!err) void refresh();
  };

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const translate = (msg: string) => {
    const m = msg.toLowerCase();
    if (m.includes("anonymous")) return "Escribe tu correo y tu contraseña antes de continuar.";
    if (m.includes("already registered") || m.includes("already been registered"))
      return "Esa cuenta ya existe. Inicia sesión o usa «He olvidado mi contraseña».";
    if (m.includes("invalid login")) return "Correo o contraseña incorrectos.";
    if (m.includes("email not confirmed")) return "Falta confirmar el correo de esa cuenta.";
    if (m.includes("password")) return "La contraseña debe tener al menos 6 caracteres.";
    if (m.includes("rate limit") || m.includes("after"))
      return "Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.";
    return msg;
  };

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Introduce un correo válido.");
      return false;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    return true;
  };

  const signIn = async () => {
    setError("");
    if (!validate()) return;
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (err) return setError(translate(err.message));
    setPassword("");
    await refresh();
  };

  const signUp = async () => {
    setError("");
    if (!validate()) return;
    setBusy(true);
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    setBusy(false);
    if (err) return setError(translate(err.message));
    setError("Cuenta creada. Revisa tu correo para confirmarla y después inicia sesión.");
  };

  const resetPassword = async () => {
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Escribe tu correo para enviarte el enlace de recuperación.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + "/reset-password",
    });
    setBusy(false);
    if (err) return setError(translate(err.message));
    setError("Te hemos enviado un correo para elegir una contraseña nueva.");
  };


  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setRows({ companies: [], buyers: [], contacts: [] });
  };

  const sendReminder = async (row: Record<string, unknown>, side: "buyer" | "seller") => {
    const companyRef = stringValue(row.empresa_ref);
    const buyerEmail = stringValue(row.comprador_email);
    const key = `${side}-${companyRef}-${buyerEmail}`;
    setNotice("");
    setReminderBusy(key);
    try {
      const result = await sendMatchReminder({ data: { companyRef, buyerEmail, recipientSide: side } });
      setNotice(result.sent ? "Recordatorio enviado." : "Ese email no se pudo enviar porque el destinatario está bloqueado.");
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "No se pudo enviar el recordatorio.");
    } finally {
      setReminderBusy("");
    }
  };

  if (checking) {
    return <Shell><p className="text-sm text-muted-foreground">Cargando…</p></Shell>;
  }

  if (!session) {
    return (
      <Shell>
        <div className="surface-card mx-auto max-w-[420px] rounded-[20px] p-8">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Acceso restringido
          </p>
          <h1 className="mb-2 text-[26px] font-bold text-primary">Panel del administrador</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Base de datos interna de la app. Solo la cuenta administradora puede ver y descargar estos datos.
          </p>
          <div className="mb-4">
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="field-label">Contraseña</label>
            <input
              className="field-input"
              type="password"
              autoComplete="current-password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && signIn()}
            />
          </div>
          {error && <p className="field-error mb-2">{error}</p>}
          <button className="btn-primary w-full" onClick={signIn} disabled={busy}>
            Entrar
          </button>
          <div className="mt-4 flex flex-col items-center gap-2 text-center">
            <button
              className="text-[13px] text-primary underline underline-offset-[3px]"
              onClick={signUp}
              disabled={busy}
            >
              Crear la cuenta de administrador
            </button>
            <button
              className="text-[13px] text-muted-foreground underline underline-offset-[3px]"
              onClick={resetPassword}
              disabled={busy}
            >
              Olvidé mi contraseña
            </button>

          </div>
        </div>
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell>
        <div className="surface-card mx-auto max-w-[460px] rounded-[20px] p-8 text-center">
          <h1 className="mb-2 text-xl font-bold text-primary">Sin permisos</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            La cuenta {session.email} no tiene rol de administrador.
          </p>
          <button className="btn-ghost" onClick={signOut}>
            Cerrar sesión
          </button>
        </div>
      </Shell>
    );
  }

  const current = rows[tab];
  const headers = current.length ? Object.keys(current[0]) : [];

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Base de datos interna</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {session.email} · acceso de administrador
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="btn-ghost">
            Ir a la app
          </Link>
          <button className="btn-ghost" onClick={() => void refresh()}>
            Actualizar
          </button>
          <button className="btn-ghost" onClick={signOut}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {notice && <p className="mb-4 rounded-lg border border-border bg-card px-4 py-2 text-[13px] text-foreground">{notice}</p>}

      <div className="mb-5 flex w-fit flex-wrap gap-1.5 rounded-[11px] border border-border bg-card p-1">
        {TABLES.map((t) => (
          <button
            key={t.name}
            onClick={() => setTab(t.name)}
            className={`rounded-lg px-4 py-2.5 text-[13px] font-semibold transition ${
              tab === t.name ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label} ({rows[t.name].length})
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-muted-foreground">Formato de descarga:</span>
        {(["xlsx", "csv"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${
              format === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
            }`}
          >
            {f === "xlsx" ? "Excel (.xlsx)" : "CSV (.csv)"}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABLES.map((t) => (
          <button
            key={t.name}
            className="btn-primary px-4 py-2.5"
            onClick={() => {
              if (format === "csv") downloadCsv(`${t.file}.csv`, rows[t.name]);
              else void downloadXlsx(`${t.file}.xlsx`, rows[t.name]);
            }}
            disabled={rows[t.name].length === 0}
          >
            ⬇ Descargar «{t.label}» ({format === "csv" ? "CSV" : "Excel"})
          </button>
        ))}
      </div>
      <p className="mb-6 text-[11.5px] text-subtle-foreground">
        Los archivos Excel se abren directamente en Excel; los CSV también se pueden importar en Google Sheets con
        Archivo → Importar.
      </p>

      <div
        className={`mb-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[15px] font-bold uppercase tracking-wide ${
          tab === "companies"
            ? "bg-primary text-primary-foreground"
            : tab === "buyers"
              ? "border-2 border-primary text-primary"
              : "border border-border text-muted-foreground"
        }`}
      >
        {tab === "companies"
          ? "Vendedores: empresas que se venden"
          : tab === "buyers"
            ? "Compradores: quienes buscan comprar"
            : "Matches: cruce completo entre comprador y vendedor"}
      </div>

      {preview && <MatchPreview row={preview} onClose={() => setPreview(null)} />}
      {tab === "contacts" && (
        <p className="mb-3 text-[12.5px] text-muted-foreground">
          Cada fila muestra un match completo: empresa, vendedor, comprador, datos de contacto, ubicación, precio y
          presupuesto, más si se envió el email automático de match a cada parte. Desde acá también podés enviar un
          recordatorio individual.
        </p>
      )}

      <div className="surface-card overflow-x-auto">
        {current.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Todavía no hay registros.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-border-soft">
                {tab !== "contacts" && <th className="px-3 py-2.5" />}
                {tab === "contacts" && (
                  <th className="whitespace-nowrap px-3 py-2.5 text-[10.5px] uppercase tracking-[0.06em] text-subtle-foreground">
                    acciones
                  </th>
                )}
                {headers.map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-3 py-2.5 text-[10.5px] uppercase tracking-[0.06em] text-subtle-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {current.map((r, i) => (
                <tr key={i} className="border-b border-border-soft last:border-0">
                  {tab !== "contacts" && (
                    <td className="px-3 py-2.5">
                      <button
                        className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold text-destructive transition hover:border-destructive"
                        onClick={() => void removeRow(r)}
                      >
                        Sacar
                      </button>
                    </td>
                  )}
                  {tab === "contacts" && (
                    <td className="min-w-[250px] px-3 py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          className="rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground"
                          onClick={() => setPreview(r)}
                        >
                          Ver
                        </button>
                        {(["seller", "buyer"] as const).map((side) => {
                          const companyRef = stringValue(r.empresa_ref);
                          const buyerEmail = stringValue(r.comprador_email);
                          const key = `${side}-${companyRef}-${buyerEmail}`;
                          return (
                            <button
                              key={side}
                              className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:opacity-60"
                              onClick={() => void sendReminder(r, side)}
                              disabled={!!reminderBusy}
                            >
                              {reminderBusy === key
                                ? "Enviando…"
                                : side === "seller"
                                  ? "Recordar vendedor"
                                  : "Recordar comprador"}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                  {headers.map((h) => (
                    <td key={h} className="max-w-[260px] truncate px-3 py-2.5">
                      {String(r[h] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto w-full max-w-[1180px]">{children}</div>
    </div>
  );
}
