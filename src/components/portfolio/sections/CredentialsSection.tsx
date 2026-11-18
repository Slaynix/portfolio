import { useState } from "react";
import { Award, Download, ExternalLink, FileText, Medal } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio-query";
import { Chip, EmptyState, Section, SectionHeading } from "@/components/portfolio/shared";
import { Reveal, Stagger, StaggerItem, TiltCard } from "@/components/portfolio/motion";
import { MediaViewer } from "@/components/portfolio/MediaViewer";

type Preview = { url: string; title: string; subtitle?: string | null };

export function CredentialsSection({ data }: { data: PortfolioData }) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const resume = data.documents.find((doc) => doc.is_primary) ?? data.documents[0];
  const otherDocs = data.documents.filter((doc) => doc.id !== resume?.id);

  const empty =
    !data.certificates.length && !data.achievements.length && !data.documents.length;

  return (
    <Section id="credentials">
      <SectionHeading
        eyebrow="Proof of work"
        title="Certificates, Achievements & Resume"
        description="Verified credentials, recognitions and downloadable documents in one place."
      />

      {empty ? (
        <EmptyState title="No credentials added yet" />
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="grid content-start gap-4">
            {data.certificates.length ? (
              <Stagger className="grid gap-3 sm:grid-cols-2">
                {data.certificates.map((certificate) => {
                  const media = certificate.file_url ?? certificate.image_url;
                  return (
                    <StaggerItem key={certificate.id} className="h-full">
                      <TiltCard intensity={5} className="h-full">
                        <article className="glass flex h-full flex-col rounded-3xl p-4 transition-colors hover:border-primary/40">
                          <div className="flex items-start gap-3">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                              <Award className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold leading-snug">
                                {certificate.title}
                              </h3>
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                {certificate.organization ?? ""}
                                {certificate.issue_date ? ` · ${certificate.issue_date}` : ""}
                              </p>
                            </div>
                          </div>
                          {certificate.skills.length ? (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {certificate.skills.slice(0, 4).map((skill) => (
                                <Chip key={skill}>{skill}</Chip>
                              ))}
                            </div>
                          ) : null}
                          <div className="mt-auto flex flex-wrap gap-2 pt-4">
                            {media ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreview({
                                    url: media,
                                    title: certificate.title,
                                    subtitle: certificate.organization,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium transition-colors hover:border-primary/50 hover:text-primary"
                              >
                                <FileText className="h-3.5 w-3.5" /> Preview
                              </button>
                            ) : null}
                            {certificate.credential_url ? (
                              <a
                                href={certificate.credential_url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium transition-colors hover:border-primary/50 hover:text-primary"
                              >
                                <ExternalLink className="h-3.5 w-3.5" /> Verify
                              </a>
                            ) : null}
                          </div>
                        </article>
                      </TiltCard>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            ) : null}

            {data.achievements.length ? (
              <Reveal>
                <div className="glass rounded-3xl p-5">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Achievements
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {data.achievements.map((achievement) => (
                      <li
                        key={achievement.id}
                        className="flex gap-3 rounded-2xl border border-border/60 bg-surface-2/40 p-3.5"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                          <Medal className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug">{achievement.title}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {achievement.organization ?? ""}
                            {achievement.achieved_on ? ` · ${achievement.achieved_on}` : ""}
                          </p>
                          {achievement.description ? (
                            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                              {achievement.description}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </div>

          <Reveal>
            <div className="glass sticky top-24 rounded-3xl p-5">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Resume
              </p>
              {resume ? (
                <>
                  <p className="mt-3 text-sm font-medium">{resume.title}</p>
                  {resume.description ? (
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {resume.description}
                    </p>
                  ) : null}
                  {resume.file_url ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPreview({
                            url: resume.file_url!,
                            title: resume.title,
                            subtitle: resume.description,
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[11px] font-semibold text-primary-foreground"
                      >
                        <FileText className="h-3.5 w-3.5" /> View resume
                      </button>
                      <a
                        href={resume.file_url}
                        download
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-[11px] font-medium transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">
                  Upload your resume from the Portfolio Manager.
                </p>
              )}

              {otherDocs.length ? (
                <ul className="mt-5 space-y-2 border-t border-border/60 pt-4">
                  {otherDocs.map((doc) => (
                    <li key={doc.id}>
                      <button
                        type="button"
                        disabled={!doc.file_url}
                        onClick={() =>
                          doc.file_url
                            ? setPreview({
                                url: doc.file_url,
                                title: doc.title,
                                subtitle: doc.kind,
                              })
                            : undefined
                        }
                        className="w-full truncate rounded-xl border border-border/60 bg-surface-2/40 px-3 py-2 text-left text-[11px] transition-colors hover:border-primary/40 disabled:opacity-50"
                      >
                        {doc.title}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Reveal>
        </div>
      )}

      {preview ? (
        <MediaViewer
          open
          onClose={() => setPreview(null)}
          url={preview.url}
          title={preview.title}
          subtitle={preview.subtitle ?? null}
        />
      ) : null}
    </Section>
  );
}