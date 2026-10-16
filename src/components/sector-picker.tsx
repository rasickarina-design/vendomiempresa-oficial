import { RUBROS } from "@/lib/marketplace";

function parse(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}

export function SectorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const selected = parse(value);

  const MAX = 3;
  const toggle = (rubro: string) => {
    if (selected.includes(rubro)) {
      onChange(selected.filter((s) => s !== rubro).join(", "));
      return;
    }
    if (selected.length >= MAX) return;
    onChange([...selected, rubro].join(", "));
  };

  return (
    <div>
    <p className="mb-2 text-[12px] text-muted-foreground">
      Puedes elegir hasta {MAX} sectores ({selected.length}/{MAX}).
    </p>
    <div className="flex flex-wrap gap-2">
      {RUBROS.map((r) => {
        const active = selected.includes(r);
        return (
          <button
            key={r}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(r)}
            className={
              "rounded-full border px-3 py-1.5 text-[11.5px] transition " +
              (active
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary-dim hover:text-foreground")
            }
          >
            {r}
          </button>
        );
      })}
    </div>
    {selected.includes("Servicios profesionales") && (
      <p className="mt-3 rounded-lg border border-primary/50 bg-primary/10 px-3 py-2 text-[13px] text-foreground">
        Elegiste «Servicios profesionales»: en la descripción de lo que buscas detalla muy bien qué tipo de
        servicios profesionales te interesan (por ejemplo: asesoría contable, despacho de abogados, consultoría,
        arquitectura, clínica…) y descríbelo con detalle.
      </p>
    )}
    </div>
  );
}
