import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DescriptionInput = {
  name: string;
  sector: string;
  city: string;
  country: string;
  age: string;
  revenue: string;
  price: string;
  notes: string;
};

const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n);

export const generateCompanyDescription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: DescriptionInput): DescriptionInput => ({
    name: clip(i.name, 100),
    sector: clip(i.sector, 100),
    city: clip(i.city, 80),
    country: clip(i.country, 80),
    age: clip(i.age, 40),
    revenue: clip(i.revenue, 60),
    price: clip(i.price, 60),
    notes: clip(i.notes, 1000),
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ok: false as const, error: "La redacción con IA no está configurada." };
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const facts = [
      `Nombre: ${data.name || "(no indicado)"}`,
      `Rubro: ${data.sector || "(no indicado)"}`,
      `Ubicación: ${[data.city, data.country].filter(Boolean).join(", ") || "(no indicada)"}`,
      `Antigüedad: ${data.age || "(no indicada)"}`,
      `Facturación anual: ${data.revenue || "(no indicada)"}`,
      `Precio pedido: ${data.price || "(no indicado)"}`,
      `Notas del vendedor: ${data.notes || "(ninguna)"}`,
    ].join("\n");
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        instructions:
          "Eres redactor de avisos de venta de pymes en LATAM y España. Escribe en español neutro una descripción atractiva, clara y profesional del aviso (máximo 900 caracteres, 2-3 párrafos cortos, sin títulos, sin emojis, sin markdown). Incluye qué hace la empresa, sus fortalezas y el motivo de venta si se indica. No inventes cifras, clientes ni datos que no estén en la información. No incluyas el nombre del vendedor, emails ni teléfonos.",
        messages: [{ role: "user", content: facts }],
        maxRetries: 0,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const text = (await result.text).trim().slice(0, 1000);
      if (!text) return { ok: false as const, error: "La IA no devolvió texto. Escribe la descripción manualmente." };
      return { ok: true as const, text };
    } catch (e) {
      const status = (e as { statusCode?: number })?.statusCode;
      const msg =
        status === 429
          ? "Demasiadas solicitudes, prueba en un minuto."
          : status === 402 || status === 403
            ? "La redacción con IA no está disponible ahora mismo."
            : "No se pudo generar la descripción. Inténtalo de nuevo.";
      return { ok: false as const, error: msg };
    }
  });
