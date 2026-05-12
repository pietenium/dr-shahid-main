"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn, truncate } from "@/lib/utils";
import type { SearchResult, SearchType } from "@/types/search";

function highlight(text: string, q: string) {
  if (!q) return [{ text, isMatch: false }] as const;
  const query = q.trim();
  if (!query) return [{ text, isMatch: false }] as const;

  const lower = text.toLowerCase();
  const qLower = query.toLowerCase();

  const parts: Array<{ text: string; isMatch: boolean }> = [];
  let idx = 0;
  while (idx < text.length) {
    const next = lower.indexOf(qLower, idx);
    if (next === -1) {
      parts.push({ text: text.slice(idx), isMatch: false });
      break;
    }
    if (next > idx) parts.push({ text: text.slice(idx, next), isMatch: false });
    parts.push({ text: text.slice(next, next + query.length), isMatch: true });
    idx = next + query.length;
  }
  return parts;
}

export function SearchResults({
  query,
  activeType,
  data,
}: {
  query: string;
  activeType: SearchType | "all";
  data: SearchResult;
}) {
  const total =
    (activeType === "all" ? data.totalResults : undefined) ??
    (activeType === "article"
      ? data.results.articles.length
      : activeType === "research"
        ? data.results.research.length
        : data.results.testimonials.length);

  const header = (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark opacity-60">
        Found {total} results for{" "}
        <span className="text-text-heading-light dark:text-text-heading-dark">
          "{query}"
        </span>
      </div>
    </div>
  );

  if (total === 0) {
    return (
      <div className="space-y-6">
        {header}
        <EmptyState
          title="No results found"
          description={`No results found for "${query}". Try a different keyword.`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}

      <div className="space-y-4">
        {(activeType === "all" || activeType === "article") &&
        data.results.articles.length ? (
          <ResultsSection title="Articles">
            {data.results.articles.map((a) => (
              <ResultRow
                key={a._id}
                href={`/articles/${a.slug}`}
                title={a.title}
                description={a.excerpt}
                query={query}
                rightBadge={
                  <Badge
                    variant={
                      a.articleType === "MEDICAL" ? "medical" : "political"
                    }
                  >
                    {a.articleType}
                  </Badge>
                }
              />
            ))}
          </ResultsSection>
        ) : null}

        {(activeType === "all" || activeType === "research") &&
        data.results.research.length ? (
          <ResultsSection title="Research">
            {data.results.research.map((r) => (
              <ResultRow
                key={r._id}
                href={`/research/${r.slug}`}
                title={r.title}
                description={r.description}
                query={query}
                rightBadge={<Badge variant="info">{r.uploadType}</Badge>}
              />
            ))}
          </ResultsSection>
        ) : null}

        {(activeType === "all" || activeType === "testimonial") &&
        data.results.testimonials.length ? (
          <ResultsSection title="Testimonials">
            {data.results.testimonials.map((t) => (
              <ResultRow
                key={t._id}
                href="/testimonials"
                title={t.name}
                description={t.content}
                query={query}
                rightBadge={<Badge variant="success">Patient</Badge>}
              />
            ))}
          </ResultsSection>
        ) : null}
      </div>
    </div>
  );
}

function ResultsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark overflow-hidden">
      <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-para-light dark:text-text-para-dark opacity-70">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-border-light dark:divide-border-dark">
        {children}
      </div>
    </section>
  );
}

function ResultRow({
  href,
  title,
  description,
  query,
  rightBadge,
}: {
  href: string;
  title: string;
  description?: string;
  query: string;
  rightBadge?: React.ReactNode;
}) {
  const desc = description ? truncate(description, 180) : "";
  const titleParts = highlight(title, query);
  const descParts = desc ? highlight(desc, query) : [];

  return (
    <Link
      href={href}
      className={cn(
        "block px-6 py-5 hover:bg-bg-light/60 dark:hover:bg-bg-dark/30 transition-colors",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="font-bold text-text-heading-light dark:text-text-heading-dark leading-snug">
            {titleParts.map((p, i) => (
              <span
                key={`${p.text}-${i}`}
                className={p.isMatch ? "text-brand-primary" : undefined}
              >
                {p.text}
              </span>
            ))}
          </div>

          {desc ? (
            <div className="text-sm text-text-para-light dark:text-text-para-dark leading-relaxed">
              {descParts.map((p, i) => (
                <span
                  key={`${p.text}-${i}`}
                  className={
                    p.isMatch
                      ? "font-semibold text-text-heading-light dark:text-text-heading-dark"
                      : undefined
                  }
                >
                  {p.text}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {rightBadge ? <div className="shrink-0">{rightBadge}</div> : null}
      </div>
    </Link>
  );
}
