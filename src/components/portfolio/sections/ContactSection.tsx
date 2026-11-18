import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import type { PortfolioData } from "@/lib/portfolio-query";
import { sendMessage } from "@/lib/portfolio.functions";
import { Section, SectionHeading } from "@/components/portfolio/shared";
import { MagneticButton, Reveal } from "@/components/portfolio/motion";
import { SocialButtons } from "@/components/portfolio/social-buttons";

export function ContactSection({ data }: { data: PortfolioData }) {
  const submit = useServerFn(sendMessage);
  const [pending, setPending] = useState(false);
  const mountedAt = useRef(Date.now());
  const profile = data.profile;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setPending(true);
    try {
      const result = await submit({
        data: {
          name: String(values.get("name") ?? ""),
          email: String(values.get("email") ?? ""),
          subject: String(values.get("subject") ?? ""),
          message: String(values.get("message") ?? ""),
          honeypot: String(values.get("company_website") ?? ""),
          elapsedMs: Date.now() - mountedAt.current,
        },
      });
      if (!result?.ok) {
        toast.error(result?.error ?? "Could not send your message.");
        return;
      }
      toast.success("Message sent — I'll get back to you soon.");
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send your message.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Section id="contact" className="pb-16">
      <SectionHeading
        eyebrow="Get in touch"
        title="Contact"
        description="Open to internships, collaborations and AI/ML product work."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="glass h-full rounded-3xl p-5">
            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" /> Reach me through the form — I reply by
                email.
              </p>
              {profile?.location ? (
                <p className="flex items-center gap-2.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> {profile.location}
                </p>
              ) : null}
            </div>
            <SocialButtons links={data.socialLinks} className="mt-5" />
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <form onSubmit={onSubmit} className="glass grid gap-3 rounded-3xl p-5 sm:grid-cols-2">
            <Field name="name" label="Name" placeholder="Your name" required />
            <Field name="email" label="Email" type="email" placeholder="you@example.com" required />
            <div aria-hidden className="hidden">
              <input name="company_website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="sm:col-span-2">
              <Field name="subject" label="Subject" placeholder="What is this about?" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Message
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me a bit about the opportunity…"
                  className="mt-1.5 w-full resize-none rounded-2xl border border-border bg-surface-2/50 px-3.5 py-2.5 text-sm font-normal normal-case tracking-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                />
              </label>
            </div>
            <div className="sm:col-span-2">
              <MagneticButton
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-ring disabled:opacity-60"
              >
                <Send className="h-4 w-4" /> {pending ? "Sending…" : "Send message"}
              </MagneticButton>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-2xl border border-border bg-surface-2/50 px-3.5 py-2.5 text-sm font-normal normal-case tracking-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
      />
    </label>
  );
}