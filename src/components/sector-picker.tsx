import { RUBROS } from "@/lib/marketplace";

function parse(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function SectorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const selected = parse(value);

  const toggle = (rubro: string) => {
    const next = selected.includes(rubro)
      ? selected.filter((s) => s !== rubro)
      : [...selected, rubro];
    onChange(next.join(", "));
  };

  return (
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
  );
}
