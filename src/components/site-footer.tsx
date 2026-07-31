import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/60 px-5 py-8">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 text-center">
        <p className="text-[13px] font-semibold text-foreground">
          Powered by Make Business Flow
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-muted-foreground">
          <a
            href="https://www.instagram.com/karinarasicfinanzas/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-primary"
          >
            @karinarasicfinanzas
          </a>
          <a
            href="mailto:contact@makebusinessesflow.com"
            className="transition hover:text-primary"
          >
            contact@makebusinessesflow.com
          </a>
          <Link to="/privacidad" className="transition hover:text-primary">
            Normas de Privacidad
          </Link>
        </div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-subtle-foreground">
          © {new Date().getFullYear()} PALFRAN LLC · Make Businesses Flow
        </p>
      </div>
    </footer>
  );
}
