import { PAISES_PRIORITARIOS, PAISES_RESTO } from "@/lib/marketplace";

/** Desplegable de países con los más habituales arriba. */
export function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Selecciona un país</option>
      <optgroup label="Más habituales">
        {PAISES_PRIORITARIOS.map((pais) => (
          <option key={pais} value={pais}>
            {pais}
          </option>
        ))}
      </optgroup>
      <optgroup label="Otros países">
        {PAISES_RESTO.map((pais) => (
          <option key={pais} value={pais}>
            {pais}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
