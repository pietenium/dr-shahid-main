import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/articles/ArticleContent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getArticleBySlug } from "@/lib/api/articles";
import { formatDate, readingTime } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const article = await getArticleBySlug(params.slug);
    return {
      title: article.title,
      description: article.excerpt || article.title,
      openGraph: {
        title: article.title,
        description: article.excerpt || article.title,
        images: article.featuredImage
          ? [{ url: article.featuredImage.url }]
          : [],
      },
    };
  } catch (_error) {
    return { title: "Article Not Found" };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  let article: import("@/types/article").Article;
  try {
    article = await getArticleBySlug(params.slug);
  } catch (_error) {
    notFound();
  }

  return (
    <article className="container mx-auto px-6 py-12 max-w-4xl">
      {/* Header */}
      <div className="space-y-8 mb-12">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-hover uppercase tracking-widest transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Back Icon</title>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Articles
        </Link>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {article.tags?.map((tag) => (
              <Badge key={tag} variant="medical">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading-light dark:text-text-heading-dark leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm font-semibold text-text-para-light dark:text-text-para-dark opacity-60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
                S
              </div>
              <span>Dr. Sahidur Rahman Khan</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>{formatDate(article.createdAt)}</span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>{readingTime(article.content)} min read</span>
          </div>
        </div>

        {article.featuredImage && (
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-border-light dark:border-border-dark">
            <Image
              src={article.featuredImage.url}
              alt={article.title}
              fill
              unoptimized
              priority
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <ArticleContent html={article.content} className="mb-16" />

      {/* Footer / CTA */}
      <div className="pt-12 border-t border-border-light dark:border-border-dark">
        <div className="bg-brand-softbg dark:bg-brand-primary/10 rounded-2xl p-8 md:p-12 text-center space-y-6">
          <h3 className="text-2xl font-bold text-text-heading-light dark:text-text-heading-dark">
            Have questions about this topic?
          </h3>
          <p className="text-text-para-light dark:text-text-para-dark max-w-xl mx-auto leading-relaxed">
            If you're experiencing symptoms discussed in this article or would
            like to discuss a treatment plan, feel free to schedule a
            consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/appointment">
              Book Appointment
            </Button>
            <Button variant="outline" size="lg" href="/contact">
              Ask a Question
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
