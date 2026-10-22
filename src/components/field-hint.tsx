import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Aviso breve que aparece al apoyar el mouse (o al enfocar con teclado) sobre
 * un campo del formulario. Se usa para explicar qué pasa si el campo se carga
 * y qué pasa si se deja vacío.
 */
export function FieldHint({ lines, text }: { lines?: string[]; text?: string }) {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            tabIndex={0}
            aria-label="Ver qué pasa si cargas este dato"
            className="ml-1.5 inline-flex size-[16px] shrink-0 cursor-help items-center justify-center rounded-full border border-muted-foreground/50 text-[10px] font-bold leading-none text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary focus-visible:outline-none"
          >
            ?
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          className="max-w-[290px] rounded-[10px] border border-primary/40 bg-popover px-3 py-2.5 text-[12px] leading-relaxed text-popover-foreground"
        >
          {lines
            ? lines.map((l, i) => (
                <p key={i} className={i ? "mt-1.5" : ""}>
                  {l}
                </p>
              ))
            : text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
