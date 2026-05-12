"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  basePath?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  basePath,
}: PaginationProps) => {
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    if (!basePath) return "#";
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${basePath}?${params.toString()}`;
  };

  const renderPageLink = (page: number) => {
    const isActive = page === currentPage;
    const content = (
      <span
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200",
          isActive
            ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-110"
            : "text-text-para-light dark:text-text-para-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-primary",
        )}
      >
        {page}
      </span>
    );

    if (onPageChange) {
      return (
        <button key={page} onClick={() => onPageChange(page)} type="button">
          {content}
        </button>
      );
    }

    return (
      <Link key={page} href={createPageUrl(page)}>
        {content}
      </Link>
    );
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-12"
      aria-label="Pagination"
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
          renderPageLink(page),
        )}
      </div>
    </nav>
  );
};
