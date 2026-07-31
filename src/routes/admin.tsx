import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { downloadCsv, downloadXlsx } from "@/lib/admin-db";

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
    ],
  }),
  component: AdminPage,
});

type TableName = "companies" | "buyers" | "contacts";

const TABLES: Array<{ name: TableName; label: string; file: string }> = [
  { name: "companies", label: "Empresas publicadas", file: "empresas.csv" },
  { name: "buyers", label: "Compradores registrados", file: "compradores.csv" },
  { name: "contacts", label: "Contactos realizados", file: "contactos.csv" },
];

function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Record<TableName, Array<Record<string, unknown>>>>({
    companies: [],
    buyers: [],
    contacts: [],
  });
  const [tab, setTab] = useState<TableName>("companies");

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
      const [c, b, ct] = await Promise.all([
        supabase.from("companies").select("*").order("created_at", { ascending: false }),
        supabase.from("buyers").select("*").order("created_at", { ascending: false }),
        supabase.from("contacts").select("*").order("created_at", { ascending: false }),
      ]);
      setRows({
        companies: (c.data ?? []) as Array<Record<string, unknown>>,
        buyers: (b.data ?? []) as Array<Record<string, unknown>>,
        contacts: (ct.data ?? []) as Array<Record<string, unknown>>,
      });
    }
    setChecking(false);
  }, []);

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
            ⬇ Descargar {t.label.toLowerCase()} ({format === "csv" ? "CSV" : "Excel"})
          </button>
        ))}
      </div>
      <p className="mb-6 text-[11.5px] text-subtle-foreground">
        Los archivos Excel se abren directamente en Excel; los CSV también se pueden importar en Google Sheets con
        Archivo → Importar.
      </p>

      <div className="surface-card overflow-x-auto">
        {current.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Todavía no hay registros.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-border-soft">
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
