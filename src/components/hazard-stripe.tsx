/**
 * Franja de peligro industrial (negro / amarillo) — elemento firma de la marca.
 * Usar con moderación: solo en los puntos de entrada clave.
 */

const stripeStyle: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, var(--primary) 0 10px, var(--background) 10px 20px)",
};

/** Franja horizontal completa. */
export function HazardStripe({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-1.5 w-full ${className}`}
      style={stripeStyle}
    />
  );
}

/** Pestaña diagonal en la esquina superior (por defecto ~32px). */
export function HazardCorner({
  size = 32,
  className = "",
  corner = "right",
}: {
  size?: number;
  className?: string;
  corner?: "left" | "right";
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-0 ${corner === "right" ? "right-0" : "left-0"} ${className}`}
      style={{
        width: size,
        height: size,
        ...stripeStyle,
        clipPath:
          corner === "right" ? "polygon(100% 0, 100% 100%, 0 0)" : "polygon(0 0, 100% 0, 0 100%)",
      }}
    />
  );
}
