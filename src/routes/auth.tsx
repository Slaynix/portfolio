import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Owner Access — Portfolio Manager" },
      {
        name: "description",
        content: "Private owner sign-in for managing portfolio content, files and documents.",
      },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Owner Access — Portfolio Manager" },
      { property: "og:description", content: "Private owner sign-in for the portfolio manager." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Owner Access — Portfolio Manager" },
      { name: "twitter:description", content: "Private owner sign-in for managing portfolio content, files and documents." },
    ],
  }),
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/manager", replace: true });
    });
  }, [navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm your account, then sign in.");
          setMode("signin");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      toast.success("Welcome back.");
      navigate({ to: "/manager", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign you in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex w-[min(440px,92vw)] flex-col justify-center py-16">
      <div className="glass rounded-3xl p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-primary">Private area</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">
          <span className="text-gradient">Owner access</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only the owner account can manage content. Visitors never see this area.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            maxLength={255}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-2/60 px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="Password"
            value={password}
            maxLength={72}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-2/60 px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signup" ? "Create owner account" : "Sign in"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          {mode === "signin"
            ? "First time? Create the owner account"
            : "Already have an account? Sign in"}
        </button>

        <Link to="/" className="mt-6 block text-xs text-muted-foreground hover:text-foreground">
          ← Back to portfolio
        </Link>
      </div>
    </div>
  );
}
