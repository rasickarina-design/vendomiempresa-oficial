import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TITLE = "Nueva contraseña — Empresas en Venta";
const DESCRIPTION = "Elegí una contraseña nueva para tu cuenta de Empresas en Venta.";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
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
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setMessage("");
    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMessage(
        error.message.toLowerCase().includes("session")
          ? "El enlace venció. Pedí uno nuevo desde el panel."
          : error.message,
      );
      return;
    }
    setMessage("Listo, contraseña actualizada. Redirigiendo…");
    setTimeout(() => void navigate({ to: "/admin" }), 1200);
  };

  return (
    <main className="mx-auto w-full max-w-[520px] px-5 py-16">
      <div className="surface-card rounded-[20px] p-8">
        <h1 className="mb-2 text-[26px] font-bold text-primary">Nueva contraseña</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Escribí la contraseña que vas a usar para entrar al panel.
        </p>
        <div className="mb-4">
          <label className="field-label">Contraseña</label>
          <input
            className="field-input"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        {message && <p className="field-error mb-2">{message}</p>}
        <button className="btn-primary w-full" onClick={submit} disabled={busy}>
          Guardar contraseña
        </button>
      </div>
    </main>
  );
}
