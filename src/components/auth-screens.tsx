import { useEffect, useRef, useState } from "react";
import type { Role } from "@/lib/marketplace";
import { genCode, maskEmail, validEmail, validPhone } from "@/lib/marketplace";
import logoAsset from "@/assets/logo.jpg.asset.json";

interface Profile {
  name: string;
  sectors: string;
  budgetMin: string;
  budgetMax: string;
  currency: string;
  locationPref: string;
  country: string;
  linkedin: string;
  thesis: string;
}

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-36 -top-48 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 8%, transparent) 0%, transparent 65%)",
        }}
      />
      <div className="surface-card relative z-[1] w-full max-w-[440px] rounded-[20px] px-8 py-9">{children}</div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </p>
  );
}

export function LoginScreen({
  onCode,
  onHome,
}: {
  onCode: (data: { email: string; phone: string; code: string; expires: number }) => void;
  onHome?: () => void;
}) {

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const submit = () => {
    const e: typeof errors = {};
    if (!validEmail(email.trim())) e.email = "Introduce un correo válido.";
    if (!validPhone(phone.trim())) e.phone = "Introduce un teléfono válido (mínimo 8 dígitos).";
    setErrors(e);
    if (Object.keys(e).length) return;
    onCode({
      email: email.trim(),
      phone: phone.trim(),
      code: genCode(),
      expires: Date.now() + 5 * 60 * 1000,
    });
  };

  return (
    <AuthCard>
      {onHome && (
        <button
          className="mb-4 cursor-pointer self-start text-[13px] text-primary underline underline-offset-[3px]"
          onClick={onHome}
        >
          ← Volver al inicio
        </button>
      )}
      <img
        src={logoAsset.url}
        alt="Logo Vendo Mi Empresa"
        className="mb-4 h-16 w-16 rounded-xl object-contain"
      />
      <Eyebrow>Portal de empresas en venta</Eyebrow>
      <h1 className="mb-3 text-[34px] font-bold uppercase leading-[1.05] tracking-[0.02em] text-primary max-[560px]:text-[28px]">
        Vendo Mi Empresa
      </h1>
      <p className="mb-3 text-[17px] font-semibold leading-snug text-foreground">
        El lugar donde vendedores y compradores de empresas se encuentran.
      </p>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Publica tu empresa o define qué estás buscando comprar. Nosotros te avisamos cuando hay match y te ponemos
        en contacto directo con la otra parte. Acceso sin contraseña: solo tu correo y un código de un solo uso.
      </p>

      <div className="mb-4">
        <label className="field-label" htmlFor="in-email">
          Correo electrónico
        </label>
        <input
          id="in-email"
          className="field-input"
          aria-invalid={!!errors.email}
          placeholder="nombre@empresa.com"
          value={email}
          maxLength={255}
          onChange={(ev) => setEmail(ev.target.value)}
          onKeyDown={(ev) => ev.key === "Enter" && submit()}
        />
        {errors.email && <p className="field-error">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="field-label" htmlFor="in-phone">
          Teléfono
        </label>
        <input
          id="in-phone"
          className="field-input"
          aria-invalid={!!errors.phone}
          placeholder="+34 600 000 000"
          value={phone}
          maxLength={18}
          onChange={(ev) => setPhone(ev.target.value)}
          onKeyDown={(ev) => ev.key === "Enter" && submit()}
        />
        {errors.phone && <p className="field-error">{errors.phone}</p>}
      </div>

      <button className="btn-primary mt-1.5 w-full" onClick={submit}>
        Enviar código de verificación
      </button>

      <div className="mt-6 flex items-start gap-2.5 rounded-[10px] border border-border-soft bg-input px-3 py-3">
        <span className="text-primary">🔒</span>
        <p className="text-[11.5px] leading-relaxed text-muted-foreground">
          No usamos contraseñas. Te enviamos un código de 6 dígitos a tu correo, válido durante 5 minutos, para
          confirmar que eres tú.
        </p>
      </div>

    </AuthCard>
  );
}

export function VerifyScreen({
  email,
  pendingCode,
  codeExpires,
  onVerified,
  onBack,
  onTooManyAttempts,
}: {
  email: string;
  pendingCode: string;
  codeExpires: number;
  onVerified: () => void;
  onBack: () => void;
  onTooManyAttempts: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const minutesLeft = Math.max(0, Math.ceil((codeExpires - Date.now()) / 60000));

  const verify = () => {
    const entered = digits.join("");
    if (entered.length < 6) return setError("Completa los 6 dígitos.");
    if (Date.now() > codeExpires) return setError("El código ha caducado. Vuelve atrás y pide uno nuevo.");
    if (entered !== pendingCode) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 5) return onTooManyAttempts();
      return setError(`Código incorrecto (intento ${next}/5).`);
    }
    onVerified();
  };

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/[^0-9]/g, "").slice(0, 1);
    setDigits((d) => d.map((x, idx) => (idx === i ? clean : x)));
    if (clean && refs.current[i + 1]) refs.current[i + 1]?.focus();
  };

  return (
    <AuthCard>
      <Eyebrow>Paso 2 de 2</Eyebrow>
      <h1 className="mb-2 text-[26px] font-bold text-primary">Confirma tu correo</h1>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        Hemos enviado un código de 6 dígitos a {maskEmail(email)}. Válido durante {minutesLeft} min.
      </p>

      <div className="mb-5 rounded-[10px] border border-dashed border-primary-dim bg-primary-soft px-3 py-3 text-[12.5px] leading-relaxed text-primary">
        MODO DEMO — esta aplicación todavía no tiene un servicio de envío de correos conectado, así que te mostramos
        el código aquí: <b className="font-mono text-[15px] tracking-[0.15em]">{pendingCode}</b>. En producción
        llegaría solo a tu buzón.
      </div>



      <div className="mb-4 flex justify-between gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            className="h-14 w-[46px] rounded-[10px] border border-border bg-input text-center font-mono text-[22px] font-bold text-primary outline-none transition focus:border-primary focus:ring-[3px] focus:ring-primary-soft max-[560px]:h-[50px] max-[560px]:w-[38px] max-[560px]:text-lg"
            value={d}
            onChange={(ev) => setDigit(i, ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Backspace" && !d && refs.current[i - 1]) refs.current[i - 1]?.focus();
              if (ev.key === "Enter") verify();
            }}
          />
        ))}
      </div>
      {error && <p className="field-error mb-2">{error}</p>}

      <button className="btn-primary w-full" onClick={verify}>
        Verificar y entrar
      </button>
      <div className="mt-5 text-center">
        <button
          className="cursor-pointer text-[13px] text-primary underline underline-offset-[3px]"
          onClick={onBack}
        >
          Volver / cambiar correo
        </button>
      </div>
    </AuthCard>
  );
}

export function RoleScreen({ onPick }: { onPick: (role: Role) => void }) {
  const opts: Array<{ role: Role; icon: string; title: string; sub: string }> = [
    {
      role: "seller",
      icon: "🏢",
      title: "Vendo mi empresa",
      sub: "Quiero publicar los datos de mi empresa para encontrar compradores.",
    },
    {
      role: "buyer",
      icon: "🔎",
      title: "Busco comprar una empresa",
      sub: "Quiero definir qué busco y que me avisen cuando haya match.",
    },
    {
      role: "both",
      icon: "🤝",
      title: "Las dos cosas",
      sub: "Vendo una empresa y también estoy evaluando comprar otra.",
    },
  ];
  return (
    <AuthCard>
      <Eyebrow>Último paso</Eyebrow>
      <h1 className="mb-2 text-[26px] font-bold text-primary">¿Qué te trae por aquí?</h1>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Así te mostramos primero lo que te interesa. Puedes hacer las dos cosas en cualquier momento.
      </p>

      <div className="flex flex-col gap-2.5">
        {opts.map((o) => (
          <button
            key={o.role}
            onClick={() => onPick(o.role)}
            className="flex cursor-pointer items-center gap-3.5 rounded-xl border border-border bg-input p-4 text-left transition hover:border-primary-dim hover:bg-card-hover"
          >
            <span className="text-[22px]">{o.icon}</span>
            <span>
              <span className="mb-0.5 block text-sm font-bold">{o.title}</span>
              <span className="block text-xs text-muted-foreground">{o.sub}</span>
            </span>
          </button>
        ))}
      </div>
    </AuthCard>
  );
}

export function ProfileScreen({
  role,
  onSave,
}: {
  role: Role;
  onSave: (profile: Profile) => void;
}) {
  const [p, setP] = useState<Profile>({
    name: "",
    sectors: "",
    budgetMin: "",
    budgetMax: "",
    currency: "USD",
    locationPref: "",
    country: "",
    linkedin: "",
    thesis: "",
  });
  const [errors, setErrors] = useState<{ name?: string; sectors?: string }>({});
  const needsBuyer = role === "buyer" || role === "both";
  const set = (k: keyof Profile, v: string) => setP((prev) => ({ ...prev, [k]: v }));

  const submit = () => {
    const e: typeof errors = {};
    if (!p.name.trim()) e.name = "Ingresá tu nombre.";
    if (needsBuyer && !p.sectors.trim())
      e.sectors = "Contanos al menos un rubro de interés para poder buscarte matches.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({ ...p, name: p.name.trim() });
  };

  return (
    <AuthCard>
      <Eyebrow>Tu perfil</Eyebrow>
      <h1 className="mb-2 text-[26px] font-bold text-primary">Contanos un poco más</h1>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Estos datos se usan para armar los matches y para que la otra parte sepa con quién está hablando.
      </p>

      <div className="mb-4">
        <label className="field-label">Nombre completo</label>
        <input
          className="field-input"
          aria-invalid={!!errors.name}
          maxLength={100}
          value={p.name}
          onChange={(e) => set("name", e.target.value)}
        />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="field-label">País</label>
        <input
          className="field-input"
          placeholder="Argentina"
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

      {needsBuyer && (
        <>
          <div className="mb-4">
            <label className="field-label">Rubros que te interesan (separados por coma)</label>
            <input
              className="field-input"
              aria-invalid={!!errors.sectors}
              placeholder="Gastronomía, Logística, Software"
              maxLength={200}
              value={p.sectors}
              onChange={(e) => set("sectors", e.target.value)}
            />
            {errors.sectors && <p className="field-error">{errors.sectors}</p>}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3.5">
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
            <select
              className="field-input"
              value={p.currency}
              onChange={(e) => set("currency", e.target.value)}
            >
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
            <label className="field-label">¿Qué tipo de empresa estás buscando?</label>
            <textarea
              className="field-input min-h-20 resize-y"
              maxLength={1000}
              value={p.thesis}
              onChange={(e) => set("thesis", e.target.value)}
            />
          </div>
        </>
      )}

      <button className="btn-primary w-full" onClick={submit}>
        Continuar
      </button>
    </AuthCard>
  );
}

export type { Profile };
