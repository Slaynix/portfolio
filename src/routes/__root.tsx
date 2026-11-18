import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BackgroundFX } from "@/components/portfolio/BackgroundFX";
import { SmoothScroll } from "@/components/portfolio/SmoothScroll";
import { ScrollProgress, Spotlight, motion } from "@/components/portfolio/motion";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "highlights", label: "Highlights" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Certificates" },
  { id: "contact", label: "Contact" },
] as const;

function useActiveSection() {
  const [active, setActive] = useState<string>("home");
  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      const line = window.scrollY + 140; // just below the sticky header
      let current: string = NAV[0]!.id;
      for (const item of NAV) {
        const element = document.getElementById(item.id);
        if (!element) continue;
        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = item.id;
      }
      // At the very bottom, always highlight the last available section.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        for (let i = NAV.length - 1; i >= 0; i -= 1) {
          const id = NAV[i]!.id;
          if (document.getElementById(id)) {
            current = id;
            break;
          }
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return active;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-gradient text-6xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Sector not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This part of the archive doesn&apos;t exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-xl font-semibold">This page didn&apos;t load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border px-5 py-2 text-sm">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Sanskar Girase" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Sanskar Girase Portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto mt-3 flex w-[min(1240px,94vw)] items-center justify-between gap-4 rounded-2xl px-4 py-2.5 glass">
        <a href="#home" className="flex items-center gap-2 font-display text-sm font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary glow-ring">
            ◇
          </span>
          <span className="text-gradient">PORTFOLIO.OS</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={
                active === item.id
                  ? "relative rounded-full px-3 py-1.5 text-xs font-medium text-primary"
                  : "relative rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {active === item.id ? (
                <motion.span
                  layoutId="nav-active"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="absolute inset-0 rounded-full bg-primary/15 ring-1 ring-primary/30"
                />
              ) : null}
              <span className="relative">{item.label}</span>
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="grid h-9 w-9 place-items-center rounded-xl border border-border md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-2 w-[min(1240px,94vw)] rounded-2xl p-3 glass md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className={
                  active === item.id
                    ? "rounded-xl bg-primary/15 px-3 py-2.5 text-sm text-primary"
                    : "rounded-xl px-3 py-2.5 text-sm text-muted-foreground"
                }
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border/60 py-7">
      <div className="mx-auto flex w-[min(1240px,94vw)] flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} — Built as an interactive digital identity.</p>
        <Link to="/manager" className="transition-colors hover:text-foreground">
          Portfolio Manager
        </Link>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll />
      <BackgroundFX />
      <ScrollProgress />
      <Spotlight />
      <SiteHeader />
      <main className="min-h-screen pt-20 sm:pt-24">
        {/* Required: nested routes render here. */}
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster />
    </QueryClientProvider>
  );
}
