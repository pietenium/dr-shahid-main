"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const TableOfContents = ({ html }: { html: string }) => {
  const [activeId, setActiveId] = useState("");
  const headings =
    html.match(/<h([2-3])[^>]*id=["']([^"']*)["'][^>]*>(.*?)<\/h\1>/g) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );

    headings.forEach((heading) => {
      const id = heading.match(/id=["']([^"']*)["']/)?.[1];
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          element.classList.add("scroll-mt-20");
          observer.observe(element);
        }
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav className="sticky top-24 hidden lg:block">
      <div className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">
          On this page
        </h4>
        <ul className="space-y-3">
          {headings.map((heading) => {
            const level = heading.match(/<h([2-3])/)?.[1];
            const id = heading.match(/id=["']([^"']*)["']/)?.[1] as string;
            const text = heading.replace(/<[^>]*>/g, "").trim();

            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={cn(
                    "block text-sm transition-colors",
                    level === "3" ? "pl-4" : "",
                    activeId === id
                      ? "text-brand-primary font-semibold"
                      : "text-text-para-light dark:text-text-para-dark hover:text-brand-primary",
                  )}
                >
                  {text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
